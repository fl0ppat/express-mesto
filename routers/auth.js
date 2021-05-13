const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { createUser, login } = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value) => {
      if (validator.isEmail(value)) return value;
      throw new Error();
    }).message('Email не прошёл проверку'),
    password: Joi.string().required().min(6).message('Пароль должен содержать не менее 6 символов'),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value) => {
      if (validator.isEmail(value)) return value;
      throw new Error();
    }).message('Email не прошёл проверку'),
    password: Joi.string().required().min(6).message('Пароль должен содержать не менее 6 символов'),
    name: Joi.string().min(2).max(30).message('Имя должно содержать не менее 2 и не более 30 символов'),
    about: Joi.string().min(2).max(30).message('Информация должна содержать не менее 2 и не более 30 символов'),
    avatar: Joi.string().custom((value) => {
      if (validator.isURL(value, { require_protocol: true })) return value;
      throw new Error();
    }).message('Ссылка на изображение содержит ошибку'),
  }),
}), createUser);

module.exports = router;
