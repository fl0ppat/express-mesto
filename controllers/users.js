const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const ConflictError = require('../errors/Conflict');
const UnauthorizedError = require('../errors/Unauthorized');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  if (!validator.isMongoId(req.params.id)) {
    throw new BadRequestError('Ошибка в полученном id');
  }

  User.findById(req.params.id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => next(err));
};

module.exports.getAuthUser = (req, res, next) => {
  if (!validator.isMongoId(req.user)) {
    throw new BadRequestError('Ошибка в полученном id');
  }

  User.findById(req.user)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!validator.isEmail(email)) throw new BadRequestError('Ошибка в полученных данных. Невалидный email');

  return bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.send({
        _id: user._id, name, about, avatar, email,
      }))
      .catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          return next(new ConflictError('Email уже зарегестрирован'));
        }

        return next(err);
      });
  });
};

module.exports.updateUserData = (req, res, next) => {
  const newData = {};

  // TODO Another Solution
  if (req.body.name) {
    newData.name = req.body.name;
  }

  if (req.body.about) {
    newData.about = req.body.about;
  }

  if (!validator.isMongoId(req.user)) {
    throw new BadRequestError('Ошибка в id пользователя');
  }

  User.findByIdAndUpdate(req.user, newData)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

module.exports.updateUserAvatar = (req, res, next) => {
  if (!validator.isMongoId(req.user)) {
    throw new BadRequestError('Ошибка в id пользователя');
  }

  User.findByIdAndUpdate(req.user, { avatar: req.body.avatar })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let _id;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Указан неверный логин или пароль'));
      }
      _id = user._id;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new UnauthorizedError('Указан неверный логин или пароль'));
      }
      return res.status(200).cookie(
        '_id',
        jwt.sign(_id.toJSON(), '12345'),
        { maxAge: 604800000, /* 7days */ httpOnly: true },
      ).status(200).send({ mesage: 'You logged in successfully!' });
    })
    .catch((err) => next(err));
};
