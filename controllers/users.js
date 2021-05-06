const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { ErrorHandler } = require('../middlewares/errors');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  if (!validator.isMongoId(req.params.id)) {
    throw new ErrorHandler(400, 'Invalid id.');
  }

  User.findById(req.params.id)
    .orFail(new ErrorHandler(404, 'User'))
    .then((user) => res.status(200).send(user))
    .catch((err) => next(err));
};

module.exports.getAuthUser = (req, res, next) => {
  User.findById(req.user)
    .orFail(new ErrorHandler(404, 'User'))
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

  if (!validator.isURL(avatar) && !avatar.match(/(https?:\/\/.*\.(?:png|jpg|webp|jpeg|gif))/i)) {
    throw new ErrorHandler(400, 'Invalid avatar URL');
  }
  if (!validator.isEmail(email)) throw new ErrorHandler(400, 'Invalid Email.');

  return bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.send({
        _id: user._id, name, about, avatar, email,
      }))
      .catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          return next(new ErrorHandler(409));
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

  User.findByIdAndUpdate(req.user, newData)
    .orFail(new ErrorHandler(404, 'User'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

module.exports.updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user, { avatar: req.body.avatar })
    .orFail(new ErrorHandler(404, 'User'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let _id;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrorHandler(401));
      }
      _id = user._id;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new ErrorHandler(401));
      }
      return res.status(200).cookie(
        '_id',
        jwt.sign(_id.toJSON(), '12345'),
        { maxAge: 604800000, /* 7days */ httpOnly: true },
      ).status(200).send({ mesage: 'You logged in successfully!' });
    })
    .catch((err) => next(err));
};
