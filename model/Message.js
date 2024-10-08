const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema(
  {
    sender_id: {
      type: ObjectId,
    },
    reciever_id: {
      type: ObjectId,
    },
    messages: {
      type: Array,
      default: [],
    },
    silenced_by: {
      type: Array,
      default: [],
    },
    cleared_by: {
      type: Array,
      default: [],
    },
    deleted_by: {
      type: Array,
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Message", messageSchema);
