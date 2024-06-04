const Post = require("../model/Post");
const Comment = require("../model/Comment");
const User = require("../model/User");
//Formatters
const postFormatter = require("../helpers/postFormatter");

const createPost = async (req, res) => {
  const { content, image, users, category_id, public, user_id } = req.body;

  try {
    await Post.create({
      content: content,
      image: image,
      users: users,
      category_id: category_id,
      public: public,
      owner_id: user_id,
    });

    res.status(200).json({
      status: 200,
      message: `Gönderi başarı ile paylaşıldı!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const createComment = async (req, res) => {
  const { post_id, user_id, content } = req.body;

  try {
    await Comment.create({
      post_id: post_id,
      user_id: user_id,
      content: content,
    });

    res.status(200).json({
      status: 200,
      message: `Yorum başarı ile paylaşıldı!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getTimeline = async (req, res) => {
  const { user_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    const posts = await Post.aggregate([
      {
        $match: {
          _id: { $exists: true },
          owner_id: { $nin: user.blockeds.concat(user_id) },
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post_id",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
    ]);

    res.status(200).json({
      status: 200,
      posts: postFormatter(posts, user),
      message: `Timeline başarı ile döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = { createPost, createComment, getTimeline };
