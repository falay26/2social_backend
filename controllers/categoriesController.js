const Category = require("../model/Category");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      status: 200,
      data: categories,
      message: `Bütün kategoriler başarı ile döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const addCategory = async (req, res) => {
  const { title_id, type_id, name, description, image, step_number } = req.body;

  try {
    await Category.create({
      title_id: title_id,
      type_id: type_id,
      name: name,
      description: description,
      image: image,
      step_number: step_number,
    });

    res.status(200).json({
      status: 200,
      message: `Kategori başarı ile eklendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateCategory = async (req, res) => {
  const {
    category_id,
    title_id,
    type_id,
    name,
    description,
    image,
    step_number,
  } = req.body;

  try {
    const category = await Category.findOne({ _id: category_id });
    category.title_id = title_id;
    category.type_id = type_id;
    category.name = name;
    category.description = description;
    category.image = image;
    category.step_number = step_number;

    await category.save();

    res.status(200).json({
      status: 200,
      message: `Kategori başarı ile güncellendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  const { category_id } = req.body;

  try {
    await Category.deleteOne({ _id: category_id }).exec();

    res.status(200).json({
      status: 200,
      message: `Kategori başarı ile silindi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
