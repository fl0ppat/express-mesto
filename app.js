const express = require('express');
const mongoose = require('mongoose');
const { isCelebrateError } = require('celebrate');
const NotFoundError = require('./errors/NotFound');
const handleError = require('./middlewares/errors');
const BadRequestError = require('./errors/BadRequest');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(require('./routers/auth'));

app.use(require('./middlewares/auth'));

app.use('/users', require('./routers/users'));
app.use('/cards', require('./routers/cards'));

app.use('/', (req, res, next) => next(new NotFoundError('Ресурс не найден')));

app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    if (err.details.has('body')) return next(new BadRequestError(err.details.get('body').message));
    if (err.details.has('params')) return next(new BadRequestError(err.details.get('params').message));
  }
  if (err.name === 'CastError') return next(new BadRequestError('Ошибка в полученных данных'));
  return next(err);
});

app.use((err, req, res, next) => handleError(err, req, res, next));

app.listen(PORT);
