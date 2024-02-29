const mongoose = require("mongoose");
const validator = require("validator");

const article = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validator: {
      validator(value) {
        return validator.isUrl(value);
      },
    },
  },
  image: {
    type: String,
    required: true,
    validator: {
      validator(value) {
        return validator.isUrl(value);
      },
    },
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    select: false,
  },
});

module.exports = mongoose.model("article", article);
