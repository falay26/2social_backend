const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    roles: {
      User: {
        type: Number,
        default: 2001,
      },
      Editor: Number,
      Admin: Number,
    },
    refreshToken: [String],
    phone_code: {
      type: String,
    },
    phone: {
      type: String,
    },
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
    register_otp: {
      type: String,
    },
    login_otp: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    profile_picture: {
      type: String,
      default: "",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("User", userSchema);
