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
    apple_id: {
      type: String,
    },
    city_id: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    email_verified: {
      type: Boolean,
      default: false,
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
    premium: {
      type: Boolean,
      default: false,
    },
    premium_start: {
      type: Date,
    },
    premium_end: {
      type: Date,
    },
    blockeds: {
      type: Array,
      default: [],
    },
    badges: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    in_categories: {
      type: Array,
      default: [],
    },
    in_sub_categories: {
      type: Array,
      default: [],
    },
    favourite_categories: {
      type: Array,
      default: [],
    },
    reminders: {
      type: Array,
      default: [],
    },
    suspended_until: {
      type: Date,
      default: null,
    },
    preferred_language: {
      type: String,
      default: "tr",
    },
    notification_preference: {
      type: Boolean,
      default: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    delete_reasons: {
      type: Array,
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("User", userSchema);
