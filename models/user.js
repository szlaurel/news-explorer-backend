const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const user = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validator: {
      validator(value) {
        return validator.isEmail(value);
      },
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: [2, "this is the minlength"],
    maxlength: [30, "this is the maxlength"],
  },
});

module.exports = mongoose.model("user", user);
