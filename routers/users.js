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
    id: Joi.string().hex().length(24).message('Ошибка в полученном id'),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).message('Имя должно содержать не менее 2 и не более 30 символов'),
    about: Joi.string().min(2).max(30).message('Информация должна содержать не менее 2 и не более 30 символов'),
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
