const Card = require("../models/card");

function handleError(err, req, res) {
  if (err.message === "NotFound") {
    res.status(404).send({ message: `Пост с id ${req.params.id} не найден` });
  } else if (err.name === "CastError") {
    res.status(400).send({
      message: `Получены некорректные данные`,
    });
  } else {
    res
      .status(500)
      .send({ message: `Внутренняя ошибка сервера. ${err.message}` });
  }
}

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => handleError(err, req, res));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => {
      res.status(200).send({ message: "Пост удалён" });
    })
    .orFail(new Error("NotFound"))
    .catch((err) => handleError(err, req, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((user) => res.send({ data: user }))
    .catch((err) => handleError(err, req, res));
};

module.exports.setCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("NotFound"))
    .then((card) => res.send(card))
    .catch((err) => handleError(err, req, res));
};

module.exports.deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("NotFound"))
    .then((card) => res.send(card))
    .catch((err) => handleError(err, req, res));
};
