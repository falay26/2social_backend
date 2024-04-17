const Type = require("../model/Type");

const getallTypes = async (req, res) => {
  try {
    const types = await Type.find();

    res.status(200).json({
      status: 200,
      data: types,
      message: `Bütün türler başarı ile döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const addType = async (req, res) => {
  const { name } = req.body;

  try {
    await Type.create({
      name: name,
    });

    res.status(200).json({
      status: 200,
      message: `Tür başarı ile eklendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateType = async (req, res) => {
  const { type_id, name } = req.body;

  try {
    const type = await Type.findOne({ _id: type_id });
    type.name = name;

    await type.save();

    res.status(200).json({
      status: 200,
      message: `Tür başarı ile güncellendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteType = async (req, res) => {
  const { type_id } = req.body;

  try {
    await Type.deleteOne({ _id: type_id }).exec();

    res.status(200).json({
      status: 200,
      message: `Tür başarı ile silindi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getallTypes,
  addType,
  updateType,
  deleteType,
};
