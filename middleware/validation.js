const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (validator.isUrl(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.createArticleValidation = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validateUrl).messages({
      "string.empty": 'The "link" field must be filled in',
      "string.uri": 'the "link" field must be a valid url',
    }),
    imageUrl: Joi.string().required().custom(validateUrl).messages({}),
  }),
});

module.exports.createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required(),
  }),
});

module.exports.authenticateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required(),
  }),
});

module.exports.validateArticleIds = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().required().length(24),
  }),
});
