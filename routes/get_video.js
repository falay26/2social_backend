const express = require("express");
const router = express.Router();
const Video = require("./../model/Video");

const get_video = async (req, res) => {
  try {
    const video = await Video.findOne().exec();

    res.status(200).json({
      status: 200,
      data: video,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

router.post("/", get_video);

module.exports = router;
