const mongoose = require("mongoose");
const schemaValidator = require("mongoose-unique-validator");
const UserSchema = new mongoose.Schema(
  {
    phoneNo: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: false,
    },

    withdrawlAdminAmount: {
      type: Number,
      default: 0,
    },
    date: String,
    timing: String,
    // status of the player pending or compeleted means false or true.
  },
  { timestamps: true }
);
UserSchema.plugin(schemaValidator);
module.exports = mongoose.model("User", UserSchema);
