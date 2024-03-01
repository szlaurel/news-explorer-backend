const router = require("express").Router();
const { NotFoundError } = require("../errors/NotFoundError");
const article = require("./article");
const user = require("./user");
const { login, createUser } = require("../controllers/user");

const {
  authenticateUser,
  createUserValidation,
} = require("../middleware/validation");

router.post("/signup", createUserValidation, createUser);
router.post("/signin", authenticateUser, login);
router.use("/articles", article);
router.use("/users", user);

router.use(() => {
  throw new NotFoundError("Router not found");
});

module.exports = router;
