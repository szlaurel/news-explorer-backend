const router = require("express").Router();
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require("../controllers/article");

const { auth } = require("../middleware/auth");

const {
  createArticleValidation,
  validateArticleIds,
} = require("../middleware/validation");

/* -------------------------------------------------------------------------- */
/*                                   Create                                   */
/* -------------------------------------------------------------------------- */

router.post("/articles", createArticleValidation, auth, createArticle);

/* -------------------------------------------------------------------------- */
/*                                    Read                                    */
/* -------------------------------------------------------------------------- */

router.get("/articles", getArticles);

/* -------------------------------------------------------------------------- */
/*                                   Update                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   Delete                                   */
/* -------------------------------------------------------------------------- */

// the delete for this might have validation, but i dont know what the ids
// are supposed to be so if an error occurs regarding the article id then it
// might have something to do with the router.delete

router.delete("/articles/articleId", validateArticleIds, auth, deleteArticle);

module.exports = router;
