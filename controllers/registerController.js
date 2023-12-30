const User = require("../model/User");
//Twillio
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken, {
  lazyLoading: true,
});
//Twillio

const handleNewUser = async (req, res) => {
  const { phone_code, phone, name, surname } = req.body;

  const duplicate = await User.findOne({
    phone_code: phone_code,
    phone: phone,
    verified: true,
  }).exec();
  if (duplicate)
    return res
      .status(400)
      .json({ status: 400, message: "Telefon numarası zaten kayıtlı." });

  try {
    let otp = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);

    client.messages
      .create({
        body: "Onay kodunuz: " + otp,
        from: "+12542384391", //Change phone number..
        to: phone_code + phone,
      })
      .then(() => {})
      .catch(() => {});

    const user = await User.create({
      phone_code: phone_code,
      phone: phone,
      name: name,
      surname: surname,
      register_otp: otp,
    });

    res.status(200).json({
      status: 200,
      data: user,
      success: "Yeni kullanıcı oluşturuldu!",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyRegisterOtp = async (req, res) => {
  const { user_id, otp } = req.body;

  const user = await User.findOne({
    _id: user_id,
  }).exec();
  if (!user)
    return res
      .status(400)
      .json({ status: 400, message: "Kullanıcı bulunamadı." });

  try {
    if (otp === user.register_otp) {
      user.verified = true;
      await user.save();

      res.status(200).json({
        status: 200,
        data: user,
        success: "Kullanıcı başarıyla doğrulandı.",
      });
    } else {
      res.status(401).json({ status: 401, message: "OTP hatalı." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser, verifyRegisterOtp };
