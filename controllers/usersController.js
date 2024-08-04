const mongoose = require("mongoose");
//Models
const User = require("../model/User");
const Category = require("../model/Category");
const SubCategories = require("../model/SubCategory");
//Formatters
const categoryFormatter = require("../helpers/categoryFormatter");
const userFormatter = require("../helpers/userFormatter");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ verified: true, deleted: false });

    res.status(200).json({
      status: 200,
      data: users,
      message: `Bütün kullanıcılar başarı ile döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const changeLanguage = async (req, res) => {
  const { user_id, language_code } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    user.preferred_language = language_code;

    await user.save();

    res.status(200).json({
      status: 200, //TODO: maybe return user.
      message: `Kullanıcı dil tercihi güncellendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const followUser = async (req, res) => {
  const { user_id, followed_user_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    if (user.following.includes(followed_user_id)) {
      res.status(400).json({
        status: 400,
        message: `Bu kullanıcıyı zaten takip ediyorsun!`,
      });
    } else {
      user.following = user.following.concat([followed_user_id]);
    }

    await user.save();

    res.status(200).json({
      status: 200, //TODO: maybe return user.
      message: `Kullanıcı başarıyla takip edildi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const unfollowUser = async (req, res) => {
  const { user_id, unfollowed_user_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    if (user.following.includes(unfollowed_user_id)) {
      user.following = user.following.filter((i) => i !== unfollowed_user_id);
    } else {
      res.status(400).json({
        status: 400,
        message: `Bu kullanıcıyı zaten takip etmiyorsun!`,
      });
    }

    await user.save();

    res.status(200).json({
      status: 200, //TODO: maybe return user.
      message: `Kullanıcı başarıyla takipten çıkarıldı!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const addReminder = async (req, res) => {
  const { user_id, category_id, day_number } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });

    if (
      user.reminders.filter((i) => i.category_id === category_id).length === 0
    ) {
      user.reminders = user.reminders.push({
        category_id: category_id,
        day_number: day_number,
        last_reminded: new Date.now(),
      });
    } else {
      user.reminders = user.reminders.map((i) => {
        if (i.category_id === category_id) {
          let new_obj = i;
          i.day_number = day_number;
          return new_obj;
        } else {
          return i;
        }
      });
    }

    await user.save();

    res.status(200).json({
      status: 200,
      message: `Kullanıcıya başarıyla hatırlatıcı eklendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const inviteParticipant = async (req, res) => {
  const { user_id, invited_user_id, category_id } = req.body;

  try {
    //TODO: send notification to invited_user_id

    res.status(200).json({
      status: 200,
      message: `Kullanıcı başarıyla davet edildi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const acceptParticipant = async (req, res) => {
  const { inviter_user_id, invited_user_id, category_id } = req.body;

  try {
    const user = await User.findOne({ _id: inviter_user_id });
    if (
      user.in_sub_categories
        .filter((i) => i.category_id === category_id)[0]
        .participants.includes(invited_user_id)
    ) {
      res.status(400).json({
        status: 400,
        message: `Kullanıcı zaten katılımcı olarak ekli!`,
      });
    } else {
      user.in_sub_categories = user.in_sub_categories
        .filter((i) => i.category_id === category_id)[0]
        .participants.push(invited_user_id);
    }

    await user.save();

    res.status(200).json({
      status: 200,
      message: `Kullanıcı katılımcı olarak eklendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const removeParticipant = async (req, res) => {
  const { inviter_user_id, invited_user_id, category_id } = req.body;

  try {
    const user = await User.findOne({ _id: inviter_user_id });
    if (
      user.in_sub_categories
        .filter((i) => i.category_id === category_id)[0]
        .participants.includes(invited_user_id)
    ) {
      user.in_sub_categories = user.in_sub_categories
        .filter((i) => i.category_id === category_id)[0]
        .participants.filter((j) => j !== invited_user_id);
    } else {
      res.status(400).json({
        status: 400,
        message: `Kullanıcı zaten katılımcı değil!`,
      });
    }

    await user.save();

    res.status(200).json({
      status: 200,
      message: `Kullanıcı katılımcı olarak kaldırıldı!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateUser = async (req, res) => {
  const { user_id, phone, email, name, city_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    user.phone = phone;
    if (user.email !== email) {
      //Send an email here with verification link..
      user.email = email;
      user.email_verified = false;
    }
    user.name = name;
    user.city_id = city_id;

    await user.save();

    res.status(200).json({
      status: 200, //TODO: maybe return user.
      message: `Kullanıcı başarıyla güncellendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getCertificates = async (req, res) => {
  const { user_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    const categories = await Category.find({
      _id: {
        $in: user.in_categories.map((i) => mongoose.Types.ObjectId(i)),
      },
    });

    await user.save();

    res.status(200).json({
      status: 200,
      certificates: categoryFormatter(categories, user, 2),
      message: `Kullanıcının sertifikaları başarıyla döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getBlockeds = async (req, res) => {
  const { user_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    const users = await User.find({
      _id: {
        $in: user.blockeds.map((i) => mongoose.Types.ObjectId(i)),
      },
    });

    await user.save();

    res.status(200).json({
      status: 200,
      users: userFormatter(users), //TODO: dummy.
      message: `Engellenenler başarıyla döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const blockUser = async (req, res) => {
  const { user_id, blocked_user_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });

    if (user.blockeds.includes(blocked_user_id)) {
      res.status(400).json({
        status: 400,
        message: `Kullanıcı zaten engellenmiş!`,
      });
    } else {
      user.blockeds = user.blockeds.concat([blocked_user_id]);
      await user.save();

      res.status(200).json({
        status: 200,
        message: `Kullanıcı başarıyla engellendi!`,
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const unblockUser = async (req, res) => {
  const { user_id, blocked_user_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });

    if (user.blockeds.includes(blocked_user_id)) {
      user.blockeds = user.blockeds.filter((i) => i !== blocked_user_id);
      await user.save();

      res.status(200).json({
        status: 200,
        message: `Kullanıcının engeli başarıyla kaldırıldı!`,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: `Kullanıcı zaten engelli değil!`,
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteProfile = async (req, res) => {
  const { user_id, reasons } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });

    user.deleted = true;
    user.delete_reasons = reasons;

    await user.save();

    res.status(200).json({
      status: 200,
      message: `Kullanıcının profili başarıyla silindi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const selectActivity = async (req, res) => {
  const { user_id, category_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });

    let olds = user?.in_categories.map((i) => i);
    if (olds?.length === 0) {
      let all_sub_categories = await SubCategories.find({
        category_id: mongoose.Types.ObjectId(category_id),
      });
      let random = Math.floor(Math.random() * all_sub_categories.length) + 1;
      let new_sub_category = all_sub_categories[random - 1];

      user.in_sub_categories = user.in_sub_categories.concat([
        {
          category_id: category_id,
          participants: [],
          sub_categories: [new_sub_category],
        },
      ]);
      user.in_categories = [category_id];

      user.markModified("in_cetagories");
      user.markModified("in_sub_cetagories");
      await user.save();

      res.status(201).json({
        status: 201,
        sub_category: new_sub_category,
        new: true,
        message: `Kullanıcı alt başlığa başarıyla eklendi! (İlk kez giriyor)`,
      });
    } else {
      let all_sub_categories = await SubCategories.find({
        _id: {
          $nin: olds.filter((i) => i === category_id),
        },
      });
      let random = Math.floor(Math.random() * all_sub_categories.length) + 1;
      let new_sub_category = all_sub_categories[random - 1];

      user.in_sub_categories = user.in_sub_categories.concat([
        new_sub_category._id,
      ]);

      user.markModified("in_cetagories");
      user.markModified("in_sub_cetagories");
      await user.save();

      res.status(200).json({
        status: 200,
        sub_category: new_sub_category,
        new: false,
        message: `Kullanıcı alt başlığa başarıyla eklendi! (İlk kez girmiyor)`,
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getFollowings = async (req, res) => {
  const { user_id } = req.body;

  try {
    let user = await User.findOne({ _id: user_id });
    let users = await User.find({
      _id: {
        $in: user.following.map((i) => mongoose.Types.ObjectId(i)),
      },
    });

    await user.save();

    res.status(200).json({
      status: 200,
      users: userFormatter(users), //TODO: dummy.
      message: `Takip edilenler başarıyla döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getUsersCategories = async (req, res) => {
  const { user_id } = req.body;

  try {
    let user = await User.findOne({ _id: user_id });
    let categories = await Category.find({
      _id: {
        $in: user.in_categories.map((i) => mongoose.Types.ObjectId(i)),
      },
    });

    res.status(200).json({
      status: 200,
      categories: categoryFormatter(categories, user, 2),
      message: `Kullanıcının bulunduğu kategoriler başarıyla döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getAllUsers,
  changeLanguage,
  followUser,
  unfollowUser,
  addReminder,
  inviteParticipant,
  acceptParticipant,
  removeParticipant,
  updateUser,
  getCertificates,
  getBlockeds,
  blockUser,
  unblockUser,
  deleteProfile,
  selectActivity,
  getFollowings,
  getUsersCategories,
};
