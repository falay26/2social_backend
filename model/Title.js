const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const titleSchema = new Schema(
  {
    name: {
      type: Object,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Title", titleSchema);
