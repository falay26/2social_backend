const Title = require("../model/Title");

const getallTitles = async (req, res) => {
  try {
    const titles = await Title.find();

    res.status(200).json({
      status: 200,
      data: titles,
      message: `Bütün üst başlıklar başarı ile döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const addTitle = async (req, res) => {
  const { name } = req.body;

  try {
    await Title.create({
      name: name,
    });

    res.status(200).json({
      status: 200,
      message: `Üst Başlık başarı ile eklendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateTitle = async (req, res) => {
  const { title_id, name } = req.body;

  try {
    const title = await Title.findOne({ _id: title_id });
    title.name = name;

    await title.save();

    res.status(200).json({
      status: 200,
      message: `Üst Başlık başarı ile güncellendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteTitle = async (req, res) => {
  const { title_id } = req.body;

  try {
    await Title.deleteOne({ _id: title_id }).exec();

    res.status(200).json({
      status: 200,
      message: `Üst Başlık başarı ile silindi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getallTitles,
  addTitle,
  updateTitle,
  deleteTitle,
};
