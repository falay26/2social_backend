const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const postSchema = new Schema(
  {
    content: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    users: {
      type: Array,
      default: [],
    },
    category_id: {
      type: ObjectId,
    },
    public: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Post", postSchema);
