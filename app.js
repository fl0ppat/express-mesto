const express = require('express');
const mongoose = require('mongoose');
const NotFoundError = require('./errors/NotFound');
const handleError = require('./middlewares/errors');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.post('/signin', require('./routers/users').login);
app.post('/signup', require('./routers/users').createUser);

app.use(require('./middlewares/auth'));

app.use('/users', require('./routers/users'));
app.use('/cards', require('./routers/cards'));

app.use('/', (err, req, res, next) => next(new NotFoundError('Ресурс не найден')));

app.use((err, req, res, next) => handleError(err, req, res, next));

app.listen(PORT);
