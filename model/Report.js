const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const reportSchema = new Schema(
  {
    reporter: {
      type: ObjectId,
      required: true,
    },
    reported: {
      type: ObjectId,
    },
    reported_id: {
      type: ObjectId,
    },
    report_type: {
      type: Array,
    },
    report: {
      type: String,
    },
    status: {
      type: String,
      default: "0",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Report", reportSchema);
