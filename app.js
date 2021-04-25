const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6081cb8887f85a4590ea47b1',
  };
  next();
});

app.use('/users', require('./routers/users'));
app.use('/cards', require('./routers/cards'));

app.use('/', (req, res) => {
  res.status(404).send({ message: 'Ресурс не найден.' });
});

app.listen(PORT, () => {
  console.log('ok');
});
