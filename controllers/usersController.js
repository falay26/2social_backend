const mongoose = require("mongoose");
const Jimp = require("jimp");
//Models
const User = require("../model/User");
const Category = require("../model/Category");
const SubCategories = require("../model/SubCategory");
//Formatters
const categoryFormatter = require("../helpers/categoryFormatter");
const userFormatter = require("../helpers/userFormatter");
//Storage
const fs = require("fs");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
} = require("firebase/storage");
//Notification
const NotificationService = require("../services/NotificationService");

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

const getUser = async (req, res) => {
  const { user_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });

    res.status(200).json({
      status: 200,
      user: userFormatter(user, 1),
      message: `Kullanıcı bilgileri döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const changeLanguage = async (req, res) => {
  const { user_id, language_code } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    if (language_code === null) {
      res.status(201).json({
        status: 201,
        language_code: user.language_code,
        message: `Kullanıcı dil bilgisi döndürüldü!`,
      });
      return;
    } else {
      user.preferred_language = language_code;

      await user.save();

      res.status(200).json({
        status: 200, //TODO: maybe return user.
        message: `Kullanıcı dil tercihi güncellendi!`,
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getSettings = async (req, res) => {
  const { user_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });

    res.status(200).json({
      status: 200,
      language: user.preferred_language,
      notification: user.notification_preference,
      image: user.profile_picture,
      message: `Kullanıcı ayarlar bilgileri döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const changeProfilePicture = async (req, res) => {
  const { user_id, image } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    const buffer = Buffer.from(image, "base64");
    const image_name = Date.now().toString();

    Jimp.read(buffer, async (err, lenna) => {
      if (err) throw err;
      lenna.quality(10).write("./uploads/" + image_name + ".jpg", () => {
        const img = fs.readFileSync("./uploads/" + image_name + ".jpg");
        const storage = getStorage();
        const imageRef = ref(storage, image_name + ".jpg");
        uploadBytes(imageRef, img).then(() => {
          getDownloadURL(imageRef).then(async (url) => {
            user.profile_picture = url;

            await user.save();

            res.status(200).json({
              status: 200,
              image: url,
              message: `Profil resmi başarıyla güncellendi!`,
            });
          });
        });
      });
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const addToProfile = async (req, res) => {
  const { user_id, post_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    if (user.added_posts.includes(post_id)) {
      res.status(400).json({
        status: 400,
        message: `Bu post zaten profile eklenmiş!`,
      });
    } else {
      user.added_posts = user.added_posts.concat([post_id]);
    }

    await user.save();

    res.status(200).json({
      status: 200,
      message: `Post başarıyla profile eklendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const addFavouriteCategory = async (req, res) => {
  const { user_id, category_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    if (user.favourite_categories.includes(category_id)) {
      res.status(400).json({
        status: 400,
        message: `Bu kategori zaten favorilere eklenmiş!`,
      });
    } else {
      user.favourite_categories = user.favourite_categories.concat([
        category_id,
      ]);
    }

    await user.save();

    res.status(200).json({
      status: 200,
      message: `Kategori başarıyla favorilere eklendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const removeFavouriteCategory = async (req, res) => {
  const { user_id, category_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    if (user.favourite_categories.includes(category_id)) {
      user.favourite_categories = user.favourite_categories.filter(
        (i) => i !== category_id
      );
    } else {
      res.status(400).json({
        status: 400,
        message: `Bu kategori zaten favorilerde değil!`,
      });
    }

    await user.save();

    res.status(200).json({
      status: 200, //TODO: maybe return user.
      message: `Kategori başarıyla favorilerden çıkarıldı!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const changeUsersPremium = async (req, res) => {
  const { user_id, premium } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    user.premium = premium;

    await user.save();

    if (premium === true) {
      NotificationService("8", user, null, null, null, async () => {
        res.status(200).json({
          status: 200,
          message: `Kullanıcı premium bilgisi güncellendi!`,
        });
      });
    }
    if (premium === false) {
      NotificationService("9", user, null, null, null, async () => {
        res.status(200).json({
          status: 200,
          message: `Kullanıcı premium bilgisi güncellendi!`,
        });
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const notificationPreference = async (req, res) => {
  const { user_id, preference } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    if (preference === null) {
      res.status(201).json({
        status: 201,
        notification_preference: user.notification_preference,
        message: `Kullanıcı bildirim tercihi döndürüldü!`,
      });
    } else {
      user.notification_preference = preference;

      await user.save();

      res.status(200).json({
        status: 200,
        message: `Kullanıcı bildirim tercihi güncellendi!`,
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const saveToken = async (req, res) => {
  const { user_id, token } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    user.notification_token = token;

    await user.save();

    res.status(200).json({
      status: 200,
      message: `Kullanıcı bildirim tokeni kaydedildi!`,
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
      await user.save();
    }

    const followed_user = await User.findOne({ _id: followed_user_id });
    NotificationService("1", followed_user, user, null, null, async () => {
      res.status(200).json({
        status: 200, //TODO: maybe return user.
        message: `Kullanıcı başarıyla takip edildi!`,
      });
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
      user.reminders = user.reminders.concat([
        {
          category_id: category_id,
          day_number: day_number,
          last_reminded: Date.now(),
        },
      ]);
    } else {
      user.reminders = user.reminders.map((i) => {
        if (i.category_id === category_id) {
          let new_obj = i;
          new_obj.day_number = day_number;
          return new_obj;
        } else {
          return i;
        }
      });
    }

    await user.markModified("reminders");

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
    const invited_user = await User.findOne({ _id: invited_user_id });
    const user = await User.findOne({ _id: user_id });
    const category = await Category.findOne({ _id: category_id });
    NotificationService("4", invited_user, user, null, category, async () => {
      res.status(200).json({
        status: 200,
        message: `Kullanıcı başarıyla davet edildi!`,
      });
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
      user.in_sub_categories = user.in_sub_categories.map((i) => {
        if (i.category_id === category_id) {
          let new_item = i;
          new_item.participants.push(invited_user_id);
          return new_item;
        } else {
          return i;
        }
      });
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
      user.in_sub_categories = user.in_sub_categories.map((i) => {
        if (i.category_id === category_id) {
          let new_item = i;
          new_item.participants = new_item.participants.filter(
            (j) => j !== invited_user_id
          );
          return new_item;
        } else {
          return i;
        }
      });
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
      users: userFormatter(users, 0), //TODO: dummy.
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
    const blocked_user = await User.findOne({ _id: blocked_user_id });

    if (user.blockeds.includes(blocked_user_id)) {
      res.status(400).json({
        status: 400,
        message: `Kullanıcı zaten engellenmiş!`,
      });
    } else {
      user.blockeds = user.blockeds.concat([blocked_user_id]);
      if (blocked_user) {
        if (!blocked_user.blocked_bys.includes(user_id)) {
          blocked_user.blocked_bys = blocked_user.blocked_bys.concat([user_id]);
          await blocked_user.save();
        }
      }
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
    const blocked_user = await User.findOne({ _id: blocked_user_id });

    if (user.blockeds.includes(blocked_user_id)) {
      user.blockeds = user.blockeds.filter((i) => i !== blocked_user_id);
      if (blocked_user) {
        if (blocked_user.blocked_bys.includes(user_id)) {
          blocked_user.blocked_bys = blocked_user.blocked_bys.filter(
            (i) => i !== user_id
          );
          await blocked_user.save();
        }
      }
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

    let olds = user?.in_categories.filter((i) => i === category_id);
    if (olds?.length === 0) {
      let all_sub_categories = await SubCategories.find({
        category_id: mongoose.Types.ObjectId(category_id),
      });
      let random = Math.floor(Math.random() * all_sub_categories.length) + 1;
      let new_sub_category = all_sub_categories[random - 1];

      res.status(201).json({
        status: 201,
        sub_category: new_sub_category,
        new: true,
        step_amount: 0,
        message: `Kullanıcı kategoriye ilk kez girecek!`,
      });
    } else {
      let all_sub_categories = await SubCategories.find({
        category_id: mongoose.Types.ObjectId(category_id),
      });
      let nin_sub_categories = all_sub_categories.filter(
        (i) =>
          !user.in_sub_categories
            .filter((j) => j.category_id === category_id)[0]
            .sub_categories.includes(i._id)
      );
      let random = Math.floor(Math.random() * nin_sub_categories.length) + 1;
      let new_sub_category = nin_sub_categories[random - 1];

      res.status(200).json({
        status: 200,
        sub_category: new_sub_category,
        new: false,
        step_amount: user.in_sub_categories.filter(
          (i) => i.category_id === category_id
        )[0].sub_categories.length,
        message: `Kullanıcı alt başlığa ilk kez girmiyor`,
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const acceptActivity = async (req, res) => {
  const { user_id, category_id, sub_category_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });

    let olds = user?.in_categories.filter((i) => i === category_id);
    if (olds.length === 0) {
      user.in_sub_categories = user.in_sub_categories.concat([
        {
          category_id: category_id,
          sub_categories: [sub_category_id],
          participants: [],
        },
      ]);
      user.in_categories = user.in_categories.concat([category_id]);

      user.markModified("in_categories");
      user.markModified("in_sub_categories");
      await user.save();
    } else {
      user.in_sub_categories = user.in_sub_categories.map((i) => {
        if (i.category_id !== category_id) {
          return i;
        } else {
          let new_obj = i;
          new_obj.sub_categories = new_obj.sub_categories.concat([
            sub_category_id,
          ]);
          return new_obj;
        }
      });

      user.markModified("in_sub_categories");
      await user.save();
    }

    res.status(200).json({
      status: 200,
      message: `Kullanıcı alt başlığa başarıyla eklendi!`,
    });
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
      users: userFormatter(users, 0), //TODO: dummy.
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

const suspendUser = async (req, res) => {
  const { user_id, month } = req.body;

  try {
    const user = await User.findOne({
      _id: user_id,
    }).exec();

    user.suspended_until = new Date(
      new Date().getTime() + month * 30 * 24 * 60 * 60 * 1000
    );
    await user.save();

    res.status(200).json({
      status: 200,
      message: "Kullanıcı başarıyla askıya alındı!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  changeLanguage,
  addToProfile,
  notificationPreference,
  saveToken,
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
  acceptActivity,
  getFollowings,
  getUsersCategories,
  suspendUser,
  changeProfilePicture,
  getSettings,
  addFavouriteCategory,
  removeFavouriteCategory,
  changeUsersPremium,
};
