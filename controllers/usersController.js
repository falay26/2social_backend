const User = require("../model/User");

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
      //Already added.
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
      message: `Kullanıcı dil tercihi güncellendi!`,
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
        $in: user.in_categories,
      },
    });

    await user.save();

    res.status(200).json({
      status: 200,
      certificates: categories, //TODO: dummy.
      message: `Sertifikalar başarıyla döndürüldü!`,
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
        $in: user.blockeds,
      },
    });

    await user.save();

    res.status(200).json({
      status: 200,
      users: users, //TODO: dummy.
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

module.exports = {
  getAllUsers,
  changeLanguage,
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
};
