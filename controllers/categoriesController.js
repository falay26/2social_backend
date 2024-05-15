const Category = require("../model/Category");
const User = require("../model/User");
const Type = require("../model/Type");
const Title = require("../model/Title");
//Formatters
const typeFormatter = require("../helpers/typeFormatter");
const titleFormatter = require("../helpers/titleFormatter");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      { $match: { _id: { $exists: true } } },
      {
        $lookup: {
          from: "titles",
          localField: "title_id",
          foreignField: "_id",
          as: "title_info",
        },
      },
      {
        $lookup: {
          from: "types",
          localField: "type_id",
          foreignField: "_id",
          as: "type_info",
        },
      },
    ]);

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

const getCategoriesMobile = async (req, res) => {
  const { user_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    const types = await Type.find();
    const titles = await Title.aggregate([
      { $match: { _id: { $exists: true } } },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "title_id",
          as: "categories_info",
        },
      },
    ]);

    res.status(200).json({
      status: 200,
      categories: [], //TODO: get from users attended categories; id, icon, name
      types: typeFormatter(types, user),
      titles: titleFormatter(titles, user),
      message: `Kategoriler başarı ile döndürüldü!`,
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
  getCategoriesMobile,
};