const handleError = (err, req, res) => {
  const { code = 500, message } = err;
  res
    .status(code)
    .send({
      message: code === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};

module.exports = handleError;
