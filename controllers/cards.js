const validator = require('validator');
const { ErrorHandler } = require('../middlewares/errors');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.deleteCardById = (req, res, next) => {
  Card.deleteOne({ _id: req.params.cardId, owner: req.user })
    .orFail(new ErrorHandler(404, 'Card'))
    .then(() => res.status(200).send({ message: 'Удалено' }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new ErrorHandler(400, 'Wrong id scheme.'));
      }
      return next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  if (!validator.isURL(link) && !link.match(/(https?:\/\/.*\.(?:png|jpg|webp|jpeg|gif))/i)) {
    throw new ErrorHandler(400, 'Invalid card image URL');
  }

  Card.create({ name, link, owner: req.user })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.setCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user } },
    { new: true },
  )
    .orFail(new ErrorHandler(404, 'Card'))
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

module.exports.deleteCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user } },
    { new: true },
  )
    .orFail(new ErrorHandler(404, 'Card'))
    .then((card) => res.send(card))
    .catch((err) => next(err));
};
