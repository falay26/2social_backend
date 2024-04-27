const Post = require("../model/Post");
const Comment = require("../model/Comment");

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
    await Post.create({
      post_id: post_id,
      user_id: user_id,
      content: content,
    });

    res.status(200).json({
      status: 200,
      message: `Gönderi başarı ile paylaşıldı!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getTimeline = async (req, res) => {
  const { user_id } = req.body;

  try {
    const posts = await Post.aggregate([
      { $match: { _id: { $exists: true }, owner_id: { $ne: user_id } } },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post_id",
          as: "comments",
        },
      },
    ]);

    res.status(200).json({
      status: 200,
      message: `Gönderi başarı ile paylaşıldı!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = { createPost, createComment, getTimeline };
