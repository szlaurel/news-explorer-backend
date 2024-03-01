// middleware/auth.js
const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../utils/config");
const { jwtSecret } = require("../utils/config");
const { UnauthorizedError } = require("../errors/UnauthorizedError");

console.log(jwtSecret);

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // this checks if headers exist and starts with bearer
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("access unauthorized");
    throw new UnauthorizedError("Authorization Required");
  }

  // if the auth header exists and is in correct format
  // it extracts the token from the header
  const token = authorization.replace("Bearer ", "");

  // if the token is verified, save the payload
  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    console.error(err.message);
    console.log("hello from the catch block");
    throw new UnauthorizedError("Authorization required");
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
