const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => res
      .status(500)
      .send({ message: `Внутренняя ошибка сервера. ${err.message}` }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      res.send(user);
    })
    .orFail(
      res
        .status(404)
        .send({ message: `Пользователь с id ${req.params.id} не найден` }),
    )
    .catch((err) => {
      res.status(500).send(`Внутренняя ошибка сервера. ${err.message}`);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: `Получены некорректные данные при создании пользователя. ${err.message}`,
        });
      } else {
        res.status(500).send(`Внутренняя ошибка сервера. ${err.message}`);
      }
    });
};

module.exports.updateUserData = (req, res) => {
  const newData = {};

  // TODO Another Solution
  if (req.body.name) {
    newData.name = req.body.name;
  }

  if (req.body.about) {
    newData.about = req.body.about;
  }

  User.findByIdAndUpdate(req.user._id, newData)
    .then((user) => {
      res.send(user);
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

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
    .then((user) => {
      res.send(user);
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
