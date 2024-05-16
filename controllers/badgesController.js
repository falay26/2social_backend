const Badge = require("../model/Badge");

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

module.exports = {
  getAllBadges,
  addBadge,
  updateBadge,
  deleteBadge,
};
