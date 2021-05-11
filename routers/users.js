const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getUsers,
  getUserById,
  getAuthUser,
  updateUserData,
  updateUserAvatar,
} = require('../controllers/users');
const BadRequestError = require('../errors/BadRequest');

router.get('/', getUsers);

router.get('/me', celebrate({
  query: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getAuthUser);

router.get('/:id', celebrate({
  query: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().alphanum().min(2).max(30),
    about: Joi.string().alphanum().min(2).max(30),
  }),
}), updateUserData);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    name: Joi.string().alphanum().min(2),
    avatar: Joi.string().min(2).required()
      .custom((value) => {
        if (validator.isURL(value, { require_protocol: true })) return value;
        throw new BadRequestError();
      })
    ,

  }),
}), updateUserAvatar);

module.exports = router;
