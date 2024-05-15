const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const subCategorySchema = new Schema(
  {
    title_id: {
      type: ObjectId,
    },
    type_id: {
      type: ObjectId,
    },
    category_id: {
      type: ObjectId,
    },
    name: {
      type: Object,
    },
    description: {
      type: Object,
    },
    image: {
      type: String,
    },
    icon: {
      type: String,
    },
    owners: {
      type: Array,
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
