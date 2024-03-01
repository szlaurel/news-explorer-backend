// const { JWT_SECRET } = require("../utils/config");
const { jwtSecret } = require("../utils/config");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const bcrypt = require("bcrypt");

const { BadRequestError } = require("../errors/BadRequestError");
const { UnauthorizedError } = require("../errors/UnauthorizedError");
const { NotFoundError } = require("../errors/NotFoundError");
const { ConflictError } = require("../errors/ConflictError");

const { CONFLICT_ERROR_CODE } = require("../utils/errors");
const { log } = require("winston");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  user
    .findById(userId)
    .then((currentUser) => {
      if (!currentUser) {
        next(new NotFoundError("user not found"));
      }
      console.log(currentUser);
      return res.status(200).send({ data: currentUser });
    })
    .catch((e) => {
      console.log(e);
      next(e);
    });
};

const createUser = (req, res, next) => {
  // we omitted the password from the req.body
  const { name, email } = req.body;

  user
    .findOne({ email })
    .then((existingUser) => {
      if (existingUser !== null) {
        const error = new Error("Email already exists");
        error.statusCode = CONFLICT_ERROR_CODE;
        throw error;
      }
      bcrypt.hash(req.body.password, 10).then((hash) => {
        user
          .create({ name, email, password: hash })
          .then((userInfo) => {
            console.log("im here in createUser");
            console.log(userInfo);
            console.log(userInfo._id);
            res.status(201).send({
              name: req.body.name,
              email: req.body.email,
            });
          })
          .catch((e) => {
            console.log("error occurred in createUser", e.status);
            console.log({ message: e.message });
            if (e.name === "VaidationError") {
              next(new BadRequestError(e.message));
            } else {
              next(e);
            }
          });
      });
    })
    .catch((e) => {
      console.log(e);
      if (e.statusCode === CONFLICT_ERROR_CODE) {
        // Handle the MongoDB duplicate key error for the 'email' field
        next(new ConflictError("Email already exists"));
      } else {
        next(e);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return user
    .findUserByCredentials(email, password)
    .then((userInfo) => {
      console.log({ e: email, p: password });
      const token = jwt.sign({ _id: userInfo._id }, jwtSecret, {
        expiresIn: "7d",
      });
      res.send({ token });
      console.log("token sent successful");
    })
    .catch((e) => {
      console.log("we landed at the auth error here in the backend for login");
      console.log({ status: e.status });
      console.error(e.message);
      next(new UnauthorizedError(e.message));
    });
};

module.exports = { getCurrentUser, createUser, login };
