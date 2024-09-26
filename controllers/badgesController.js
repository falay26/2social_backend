const Badge = require("../model/Badge");
const User = require("../model/User");
const Category = require("../model/Category");
const Post = require("../model/Post");
const mongoose = require("mongoose");
//Formatters
const badgeFormatter = require("../helpers/badgeFormatter");
const categoryFormatter = require("../helpers/categoryFormatter");

const getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.aggregate([
      { $match: { _id: { $exists: true } } },
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
      data: badges,
      message: `Bütün rozetler başarı ile döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const addBadge = async (req, res) => {
  const { type_id, name, description, image } = req.body;

  try {
    await Badge.create({
      type_id: type_id,
      name: name,
      description: description,
      image: image,
    });

    res.status(200).json({
      status: 200,
      message: `Rozet başarı ile eklendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateBadge = async (req, res) => {
  const { badge_id, type_id, name, description, image } = req.body;

  try {
    const badge = await Badge.findOne({ _id: badge_id });
    badge.type_id = type_id;
    badge.name = name;
    badge.description = description;
    badge.image = image;

    await badge.save();

    res.status(200).json({
      status: 200,
      message: `Rozet başarı ile güncellendi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteBadge = async (req, res) => {
  const { badge_id } = req.body;

  try {
    await Badge.deleteOne({ _id: badge_id }).exec();

    res.status(200).json({
      status: 200,
      message: `Rozet başarı ile silindi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getCareer = async (req, res) => {
  const { user_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    const badges = await Badge.find();

    const categories = await Category.aggregate([
      {
        $match: {
          _id: {
            $in: user.in_categories.map((i) => mongoose.Types.ObjectId(i)),
          },
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
    const new_categories = await Promise.all(
      categories.map(async (category) => {
        let new_obj = category;
        new_obj.reminder = 1;
        new_obj.reminder = user.reminders.filter(
          (i) => i.category_id === category?._id?.toString()
        )[0]?.day_number;
        const posts = await Post.find({
          owner_id: user_id,
          category_id: category._id,
        });
        new_obj.posts = posts;
        return new_obj;
      })
    );

    res.status(200).json({
      status: 200,
      badges: badgeFormatter(badges, user),
      categories: categoryFormatter(new_categories, user, 0),
      message: `Kariyer sayfası başarıyla dönüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getAllBadges,
  addBadge,
  updateBadge,
  deleteBadge,
  getCareer,
};
