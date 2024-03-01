const mongoose = require("mongoose");
const article = require("../models/article");

const { BadRequestError } = require("../errors/BadRequestError");
const { UnauthorizedError } = require("../errors/UnauthorizedError");
const { NotFoundError } = require("../errors/NotFoundError");
const { ConflictError } = require("../errors/ConflictError");
const { log } = require("winston");

const {
  NOT_FOUND_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
} = require("../utils/errors");

/* -------------------------------------------------------------------------- */
/*                            get items controller                            */
/* -------------------------------------------------------------------------- */

const getArticles = (req, res, next) => {
  article
    .find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((e) => {
      console.log(e);
      next(e);
    });
};

/* -------------------------------------------------------------------------- */
/*                          create article controller                         */
/* -------------------------------------------------------------------------- */

const createArticle = (res, req, next) => {
  console.log(req);
  console.log(req.body);

  const owner = req.user._id;

  const { keyword, title, text, date, source, link, imageUrl } = req.body;

  article
    .create({ keyword, title, text, date, source, link, imageUrl, owner })
    .then((article) => {
      console.log(article);
      console.log("im in the create article");
      if (article.imageUrl === null || undefined) {
        console.log("the image is undefined");
      } else if (article.source === null) {
        console.log("the source for the article is null ");
      } else {
        console.log("good to go");
      }
      res.send({ data: article });
    })
    .catch((e) => {
      console.log(e.name);
      console.log("im in the catch block for createArticle");
      console.log("if error occured heres the imageUrl", article.imageUrl);
      console.log("if error occured heres the source", article.source);
      if (e.name === "ValidationError") {
        console.error(e);
        next(new BadRequestError("Error validation occurred"));
      } else {
        next(e);
      }
    });
};

/* -------------------------------------------------------------------------- */
/*                          delete article controller                         */
/* -------------------------------------------------------------------------- */

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  const userId = req.user._id;

  article
    .findById(articleId)
    .then((article) => {
      if (article === null) {
        throw new NotFoundError(
          "Article id was not found or the article doesn't exist",
        );
      }
      if (article.owner.equals(userId)) {
        console.log(article.owner, "IM HERE in the delete article");
        return article.findByIdAndDelete(articleId).then(() => {
          res.message({ message: "article deleted" });
        });
      }
      console.log(article.owner, "im in here");
      console.log(new mongoose.Types.ObjectId(userId), "this is the userId");
      console.log("something bad happened here");
      throw new Error("the owner ids don't match womp womp");
    })
    .catch((e) => {
      console.log("error occurred", e.name);
      console.log("im in the catch block for delete article");
      console.log({ message: e.message });
      if (e.name === "CastError") {
        next(new BadRequestError("incorrect or _id or _id does not exist"));
      } else if (e.message === "the owner ids dont match") {
        next(new ForbiddenError("ids do not match"));
      } else if (e.statusCode === NOT_FOUND_ERROR_CODE) {
        next(new NotFoundError("_id was not found or does not exist"));
      } else if (e.statusCode === FORBIDDEN_ERROR_CODE) {
        next(new ForbiddenError("you do not have access to this content"));
      } else {
        next(e);
      }
    });
};

module.exports = { getArticles, createArticle, deleteArticle };
