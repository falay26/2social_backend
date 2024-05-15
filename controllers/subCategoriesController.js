const SubCategory = require("../model/SubCategory");

const getAllCategories = async (req, res) => {
  try {
    const categories = await SubCategory.aggregate([
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
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_info",
        },
      },
    ]);

    res.status(200).json({
      status: 200,
      data: categories,
      message: `Bütün alt kategoriler başarı ile döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const addCategory = async (req, res) => {
  const { title_id, type_id, category_id, name, description, image } = req.body;

  try {
    await SubCategory.create({
      title_id: title_id,
      type_id: type_id,
      category_id: category_id,
      name: name,
      description: description,
      image: image,
    });

    res.status(200).json({
      status: 200,
      message: `Alt Kategori başarı ile eklendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateCategory = async (req, res) => {
  const {
    sub_category_id,
    title_id,
    type_id,
    category_id,
    name,
    description,
    image,
  } = req.body;

  try {
    const category = await SubCategory.findOne({ _id: sub_category_id });
    category.title_id = title_id;
    category.type_id = type_id;
    category.category_id = category_id;
    category.name = name;
    category.description = description;
    category.image = image;

    await category.save();

    res.status(200).json({
      status: 200,
      message: `Alt Kategori başarı ile güncellendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  const { category_id } = req.body;

  try {
    await SubCategory.deleteOne({ _id: category_id }).exec();

    res.status(200).json({
      status: 200,
      message: `Alt Kategori başarı ile silindi!`,
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
