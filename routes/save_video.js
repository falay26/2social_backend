const express = require("express");
const router = express.Router();
const Video = require("./../model/Video");

const save_video = async (req, res) => {
  const { play, index } = req.body;

  try {
    const video = await Video.findOne().exec();

    if (!video) {
      await Video.create({
        play: play,
        index: index,
      });
    } else {
      video.play = play;
      video.index = index;
      await video.save();
    }

    res.status(200).json({
      status: 200,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

router.post("/", save_video);

module.exports = router;
