const User = require('../models/user');

function handleError(err, req, res) {
  if (err.message === 'NotFound') {
    res
      .status(404)
      .send({ message: `Пользователь с id ${req.params.id} не найден.` });
  } else if (err.name === 'CastError' || 'ValidationError') {
    res.status(400).send({
      message: `Получены некорректные данные. ${err.message}`,
    });
  } else {
    res
      .status(500)
      .send({ message: `Внутренняя ошибка сервера. ${err.message}` });
  }
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => res
      .status(500)
      .send({ message: `Внутренняя ошибка сервера. ${err.message}` }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, req, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, req, res));
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
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, req, res));
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, req, res));
};
