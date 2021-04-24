const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: `Получены некорректные данные. ${err.message}` });
      } else {
        res.status(500).send(`Внутренняя ошибка сервера. ${err.message}`);
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => {
      res.status(200).send({ message: 'Пост удалён' });
    })
    .orFail((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: `Получены некорректные данные. ${err.message}` });
      } else if (err.name === 'DocumentNotFoundError') {
        res
          .status(404)
          .send({ message: `Пользователь с id ${req.params.id} не найден` });
      }
    })
    .catch((err) => {
      res.status(500).send(`Внутренняя ошибка сервера. ${err.message}`);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: `Получены некорректные данные. ${err.message}` });
      } else {
        res.status(500).send(`Внутренняя ошибка сервера. ${err.message}`);
      }
    });
};

module.exports.setCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .orFail((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: `Получены некорректные данные. ${err.message}` });
      } else if (err.name === 'DocumentNotFoundError') {
        res
          .status(404)
          .send({ message: `Пользователь с id ${req.params.id} не найден` });
      }
    })
    .catch((err) => {
      res.status(500).send(`Внутренняя ошибка сервера. ${err.message}`);
    });
};

module.exports.deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .orFail((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: `Получены некорректные данные. ${err.message}` });
      } else if (err.name === 'DocumentNotFoundError') {
        res
          .status(404)
          .send({ message: `Пользователь с id ${req.params.id} не найден` });
      }
    })
    .catch((err) => {
      res.status(500).send(`Внутренняя ошибка сервера. ${err.message}`);
    });
};
