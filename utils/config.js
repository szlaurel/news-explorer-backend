const { JWT_SECRET } = process.env;

const jwtSecret =
  process.env.NODE_ENV === "production" ? JWT_SECRET : "default-value-for-dev";

module.exports = {
  jwtSecret,
};

/* -------------------------------------------------------------------------- */
/*                           old module.exports code                          */
/* -------------------------------------------------------------------------- */

// uncomment everything thats underneath this comment and copy and paste everything thats
// underneath this comment and paste it above overwriting the code above

// module.exports = {
//   JWT_SECRET: "my-secret-key",
// };

/* -------------------------------------------------------------------------- */
/*     original process.env code before the switch up to ternary statement    */
/* -------------------------------------------------------------------------- */
// The original process.env.NODE_ENV code before we made the slight tweak to the code
// by telling it that the NODE_ENV shouldnt equal the production
// I think thats what im doing going to have to read up more on that

// const { JWT_SECRET } = process.env;

// const jwtSecret =
//   process.env.NODE_ENV === "production" ? JWT_SECRET : "default-value-for-dev";

// module.exports = {
//   jwtSecret,
// };
