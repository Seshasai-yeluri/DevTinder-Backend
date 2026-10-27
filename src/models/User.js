const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    photoUrl: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    skills: {
      type: [String],
      required: true,
      default: undefined,
      validate: {
        validator: function (data) {
          return Array.isArray(data) && data.length > 0;
        },
        message: "At least one skill is required",
      },
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
