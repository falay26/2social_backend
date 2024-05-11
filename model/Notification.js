const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const notificationSchema = new Schema(
  {
    user_id: {
      type: ObjectId,
    },
    related_user_id: {
      type: ObjectId,
    },
    category_id: {
      type: ObjectId,
    },
    type: {
      type: String,
    },
    title: {
      type: Object,
    },
    message: {
      type: Object,
    },
    readed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Notification", notificationSchema);
