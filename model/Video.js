const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const videoSchema = new Schema(
  {
    play: {
      type: Boolean,
    },
    index: {
      type: Number,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Video", videoSchema);
