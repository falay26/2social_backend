const Post = require("../model/Post");
const Comment = require("../model/Comment");
const User = require("../model/User");
//Formatters
const postFormatter = require("../helpers/postFormatter");
const commentFormatter = require("../helpers/commentFormatter");

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

const likePost = async (req, res) => {
  const { post_id, user_id } = req.body;

  try {
    const post = await Post.findOne({
      _id: post_id,
    }).exec();

    if (post.likes.includes(user_id)) {
      res.status(400).json({
        status: 400,
        message: `Gönderi zaten beğenilmiş!`,
      });
      return;
    }
    post.likes = post.likes.concat([user_id]);
    await post.save();

    res.status(200).json({
      status: 200,
      message: `Gönderi başarı ile beğenildi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const unlikePost = async (req, res) => {
  const { post_id, user_id } = req.body;

  try {
    const post = await Post.findOne({
      _id: post_id,
    }).exec();

    if (post.likes.includes(user_id)) {
      post.likes = post.likes.filter((i) => i !== user_id);
      await post.save();
      res.status(200).json({
        status: 200,
        message: `Gönderi başarıyla unlike edildi!`,
      });
      return;
    }
    res.status(400).json({
      status: 400,
      message: `Gönderi zaten henüz beğenilmemiş!`,
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

const likeComment = async (req, res) => {
  const { comment_id, user_id } = req.body;

  try {
    const comment = await Comment.findOne({
      _id: comment_id,
    }).exec();

    if (comment.likes.includes(user_id)) {
      res.status(400).json({
        status: 400,
        message: `Yorum zaten beğenilmiş!`,
      });
      return;
    }
    comment.likes = comment.likes.concat([user_id]);
    await comment.save();

    res.status(200).json({
      status: 200,
      message: `Yorum başarı ile beğenildi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const unlikeComment = async (req, res) => {
  const { comment_id, user_id } = req.body;

  try {
    const comment = await Comment.findOne({
      _id: comment_id,
    }).exec();

    if (comment.likes.includes(user_id)) {
      comment.likes = comment.likes.filter((i) => i !== user_id);
      await comment.save();
      res.status(200).json({
        status: 200,
        message: `Yorum başarıyla unlike edildi!`,
      });
      return;
    }

    res.status(400).json({
      status: 400,
      message: `Yorum zaten beğenilmemiş!`,
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
    ]).sort({
      created_at: -1,
    });

    res.status(200).json({
      status: 200,
      posts: postFormatter(posts, user),
      message: `Timeline başarı ile döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getComments = async (req, res) => {
  const { post_id, user_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    const comments = await Comment.aggregate([
      {
        $match: {
          post_id: post_id,
          user_id: {
            $nin: user.blockeds.map((i) => mongoose.Types.ObjectId(i)),
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
    ]);

    res.status(200).json({
      status: 200,
      comments: commentFormatter(comments),
      message: `Yorumlar başarı ile dönüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  createPost,
  likePost,
  unlikePost,
  createComment,
  likeComment,
  unlikeComment,
  getTimeline,
  getComments,
};
