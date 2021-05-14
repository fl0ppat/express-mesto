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

router.get('/', getUsers);
router.get('/me', getAuthUser);

router.get('/:id', celebrate({
  query: Joi.object().keys({
    id: Joi.string().hex().length(24).messages({
      'string.hex': 'Ошибка в полученном id',
      'string.length': 'Ошибка в полученном id',
    }),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Имя может содержать не менее {#limit} символов',
      'string.max': 'Имя может содержать не более {#limit} символов',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Информация может содержать не менее {#limit} символов',
      'string.max': 'Информация может содержать не более {#limit} символов',
    }),
  }),
}), updateUserData);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(2).required()
      .custom((value) => {
        if (validator.isURL(value, { require_protocol: true })) return value;
        throw new Error();
      })
      .message('Ссылка на аватар не прошла проверку'),
  }),
}), updateUserAvatar);

module.exports = router;
