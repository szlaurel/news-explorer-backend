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

user.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select("+password")
    .then((userInfo) => {
      console.log(
        userInfo,
        "this is where the null comes from in the user.statics.finduserbycredentials just in case it shows up null",
      );
      if (!userInfo) {
        return Promise.reject(new Error("Nonexistent userInfo"));
      } // read up more on bcrypt to understand why we pass !matched instead of just regular matched in the if statement
      return bcrypt.compare(password, userInfo.password).then((matched) => {
        if (!matched) {
          console.log(matched, "the data is matched");
          console.log({ userInfo });
          console.log({
            pwd: password,
            user: userInfo.password,
            e: userInfo.email,
          });
          console.log(
            "the problem is here in user.static.finduserbycredentials",
          );
          return new Promise.reject(new Error("Incorrect email or password"));
        }
        return userInfo;
      });
    });
};

module.exports = mongoose.model("user", user);
