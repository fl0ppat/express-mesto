const NotFoundError = require('../errors/NotFound');
const ForbiddenError = require('../errors/Forbidden');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById({ _id: req.params.cardId, owner: req.user })
    .orFail(new NotFoundError('Пост не найден'))
    .then((card) => {
      if (req.user !== card.owner.toString()) {
        throw new ForbiddenError('Вы не можете удалять чужие карточки');
      }

      Card.deleteOne(card)
        .then(res.status(200).send({ message: 'Удалено' }))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

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
    .orFail(new NotFoundError('Пост не найден'))
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

module.exports.deleteCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user } },
    { new: true },
  )
    .orFail(new NotFoundError('Пост не найден'))
    .then((card) => res.send(card))
    .catch((err) => next(err));
};
