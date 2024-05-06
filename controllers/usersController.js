const User = require("../model/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ verified: true });

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

module.exports = {
  getAllUsers,
  changeLanguage,
  unfollowUser,
};
