const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getCards,
  createCard,
  deleteCardById,
  setCardLike,
  deleteCardLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).messages({
      'string.hex': 'Ошибка в полученном id',
      'string.length': 'Ошибка в полученном id',
    }),
  }),
}), deleteCardById);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'any.required': 'Название карточки обязательно',
        'string.min': 'Название карточки должно содержать минимум {#limit} символа',
        'sting.max': 'Название карточки должно содержать максимум {#limit} символа',
      }),
    link: Joi.string().required()
      .custom((value) => {
        if (validator.isURL(value, { require_protocol: true })) return value;
        throw Error();
      }).messages({
        'any.required': 'Ссылка на изображение обязательно',
        'any.custom': 'Указана невалидная ссылка на изображение',
      }),

  }),
}), createCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).messages({
      'string.hex': 'Ошибка в полученном id',
      'string.length': 'Ошибка в полученном id',
    }),
  }),
}), setCardLike);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).messages({
      'string.hex': 'Ошибка в полученном id',
      'string.length': 'Ошибка в полученном id',
    }),
  }),
}), deleteCardLike);

module.exports = router;
