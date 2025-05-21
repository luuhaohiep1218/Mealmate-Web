const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      validate(value) {
        if (!/^\d{10}$/.test(value)) {
          throw new Error("Phone number must be exactly 10 digits");
        }
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    date_of_birth: {
      type: Date,
    },
    job: {
      type: String,
      trim: true,
    },
    height: {
      type: Number, // cm
      min: 0,
    },
    weight: {
      type: Number, // kg
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
