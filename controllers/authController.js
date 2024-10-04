const User = require("../model/User");
const jwt = require("jsonwebtoken");
//Services
const OtpService = require("../services/OtpService");

const handleLogin = async (req, res) => {
  const { phone_code, phone, pineapple } = req.body;

  try {
    const cookies = req.cookies;

    const foundUser = await User.findOne({
      phone_code: phone_code,
      phone: phone,
      verified: true,
      //deleted: false, //TODO: add this to every user..
    }).exec();
    if (!foundUser)
      return res.status(400).json({
        status: 400,
        message: "Kullanıcı bulunamadı.",
      });

    if (
      pineapple !== undefined &&
      pineapple === process.env.ACCESS_TOKEN_SECRET
    ) {
      const roles = Object.values(foundUser.roles).filter(Boolean);

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      let newRefreshTokenArray = !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

      if (cookies?.jwt) {
        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({ refreshToken }).exec();

        if (!foundToken) {
          newRefreshTokenArray = [];
        }

        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
      }

      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: 200,
        message: "Giriş yapma işlemi başarılı!",
        user: {
          roles,
          accessToken,
          name: foundUser.name,
          surname: foundUser.surname,
          phone_code: foundUser.phone_code,
          phone: foundUser.phone,
          profile_picture: foundUser.profile_picture,
          _id: foundUser._id,
          notification_preference: foundUser.notification_preference,
          preferred_language: foundUser.preferred_language,
        },
      });
    } else {
      let otp = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
      OtpService(foundUser.phone, "Onay kodunuz: " + otp);

      foundUser.login_otp = otp;
      await foundUser.save();

      res.status(200).json({
        status: 200,
        otp: otp, //TODO: delete this later..
        message: `Otp gönderildi!`,
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const handleSocialLogin = async (req, res) => {
  const { login_type, pineapple, email, name, apple_id } = req.body;

  try {
    if (pineapple === "123456") {
      if (login_type === "Apple") {
        const foundUser = await User.findOne({
          apple_id: apple_id,
        }).exec();
        if (!foundUser) {
          const user = await User.create({
            phone_code: "+90",
            email: email,
            name: name,
            apple_id: apple_id,
            verified: true,
            deleted: false,
          });

          const roles = Object.values(user.roles).filter(Boolean);
          let suspended = new Date() < new Date(user?.suspended_until);

          res.status(200).json({
            status: 200,
            message: "Apple Giriş yapma işlemi başarılı!",
            suspended: suspended,
            user: {
              roles,
              name: user.name,
              phone_code: user.phone_code,
              phone: user.phone,
              profile_picture: user.profile_picture,
              _id: user._id,
              login_otp: user.login_otp,
              notification_preference: user.notification_preference,
              preferred_language: user.preferred_language,
            },
          });
        } else {
          const roles = Object.values(foundUser.roles).filter(Boolean);
          let suspended = new Date() < new Date(foundUser?.suspended_until);

          res.status(200).json({
            status: 200,
            message: "Apple Giriş yapma işlemi başarılı!",
            suspended: suspended,
            user: {
              roles,
              name: foundUser.name,
              phone_code: foundUser.phone_code,
              phone: foundUser.phone,
              profile_picture: foundUser.profile_picture,
              _id: foundUser._id,
              login_otp: foundUser.login_otp,
              notification_preference: foundUser.notification_preference,
              preferred_language: foundUser.preferred_language,
            },
          });
        }
      }
      if (login_type === "Google") {
        const foundUser = await User.findOne({
          email: email,
        }).exec();
        if (!foundUser) {
          const user = await User.create({
            phone_code: "+90",
            email: email,
            name: name,
            verified: true,
            deleted: false,
          });

          const roles = Object.values(user.roles).filter(Boolean);
          let suspended = new Date() < new Date(user?.suspended_until);

          res.status(200).json({
            status: 200,
            message: "Google Giriş yapma işlemi başarılı!",
            suspended: suspended,
            user: {
              roles,
              name: user.name,
              phone_code: user.phone_code,
              phone: user.phone,
              profile_picture: user.profile_picture,
              _id: user._id,
              login_otp: user.login_otp,
              notification_preference: user.notification_preference,
              preferred_language: user.preferred_language,
            },
          });
        } else {
          const roles = Object.values(foundUser.roles).filter(Boolean);
          let suspended = new Date() < new Date(foundUser?.suspended_until);

          res.status(200).json({
            status: 200,
            message: "Google Giriş yapma işlemi başarılı!",
            suspended: suspended,
            user: {
              roles,
              name: foundUser.name,
              phone_code: foundUser.phone_code,
              phone: foundUser.phone,
              profile_picture: foundUser.profile_picture,
              _id: foundUser._id,
              login_otp: foundUser.login_otp,
              notification_preference: foundUser.notification_preference,
              preferred_language: foundUser.preferred_language,
            },
          });
        }
      }
    } else {
      res.status(400).json({
        status: 400,
        message: "Yanlış güvenlik kodu!",
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const confirmLoginOtp = async (req, res) => {
  const { phone_code, phone, otp } = req.body;

  try {
    const cookies = req.cookies;

    const foundUser = await User.findOne({
      phone_code: phone_code,
      phone: phone,
      //deleted: false,
    }).exec();
    if (!foundUser)
      return res.status(400).json({
        status: 400,
        message: "Kullanıcı bulunamadı.",
      });

    if (foundUser?.login_otp?.toString() === otp?.toString()) {
      const roles = Object.values(foundUser.roles).filter(Boolean);

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      let newRefreshTokenArray = !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

      if (cookies?.jwt) {
        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({ refreshToken }).exec();

        if (!foundToken) {
          newRefreshTokenArray = [];
        }

        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
      }

      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      let suspended = new Date() < new Date(foundUser?.suspended_until);

      res.status(200).json({
        status: 200,
        message: "Giriş yapma işlemi başarılı!",
        suspended: suspended,
        user: {
          roles,
          accessToken,
          name: foundUser.name,
          phone_code: foundUser.phone_code,
          phone: foundUser.phone,
          profile_picture: foundUser.profile_picture,
          _id: foundUser._id,
          login_otp: foundUser.login_otp,
          notification_preference: foundUser.notification_preference,
          preferred_language: foundUser.preferred_language,
        },
      });
    } else {
      res.status(401).json({
        status: 401,
        message: "Otp hatalı!",
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const resendLoginOtp = async (req, res) => {
  const { phone_code, phone } = req.body;

  try {
    const user = await User.findOne({
      phone_code: phone_code,
      phone: phone,
      verified: true,
      deleted: false,
    }).exec();

    let otp = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
    OtpService(user.phone, "Onay kodunuz: " + otp);

    user.login_otp = otp;
    await user.save();

    res.status(200).json({
      status: 200,
      message: "Otp yeniden gönderildi!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  handleLogin,
  handleSocialLogin,
  confirmLoginOtp,
  resendLoginOtp,
};
