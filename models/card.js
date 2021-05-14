const mongoose = require('mongoose');
const validator = require('validator');

const cardsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator(link) {
          return validator.isURL(link, { require_protocol: true });
          // Не стал на прошлой итерации вставлять сюда валидацию,
          // т.к. аналогичная валидация уже была внутри роутов
        },
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardsSchema);
