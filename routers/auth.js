const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { createUser, login } = require('../controllers/users');
const UnauthorizedError = require('../errors/Unauthorized');
const BadRequestError = require('../errors/BadRequest');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value) => {
      if (validator.isEmail(value)) return value;
      throw new UnauthorizedError();
    }),
    password: Joi.string().required().min(6),
  }),
}), login);

/**
 * Большое спасибо за такое обширное ревью!
 * Хотел сделать кастомные ошибки при валидации,
 * использовал метод Joi.error(), куда передавал
 * свою ошибку, но всё ломалось с ошибкой:
 * AssertionError [ERR_ASSERTION]: value must be a joi validation error
 * Если я правильно понял, то это связано с тем, что
 * Joi используется внутри celebrate.
 *
 * Пока не смог это исправить :c
 */

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value) => {
      if (validator.isEmail(value)) return value;
      throw new UnauthorizedError();
    }),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value) => {
      if (validator.isURL(value, { require_protocol: true })) return value;
      throw new BadRequestError();
    }),
  }),
}), createUser);

module.exports = router;
