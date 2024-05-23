const Support = require("../model/Support");

const getallSupports = async (req, res) => {
  try {
    const supports = await Support.find();

    res.status(200).json({
      status: 200,
      data: supports,
      message: `Bütün destekler başarı ile döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const createSupport = async (req, res) => {
  const { user_id, text } = req.body;

  try {
    await Support.create({
      user_id: user_id,
      text: text,
    });

    res.status(200).json({
      status: 200,
      message: `Destek başarı ile eklendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getallSupports,
  createSupport,
};
