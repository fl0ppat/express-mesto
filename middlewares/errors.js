const handleError = (err, res) => {
  switch (err.code) {
    case 400:
      res
        .status(400)
        .send({ message: `Request params error. ${err.message && err.message}` });
      break;

    case 401:
      res
        .status(401)
        .send({ message: 'Wrong email or password.' });
      break;

    case 404:
      res
        .status(404)
        .send({ message: `${err.message} not found.` });
      break;

    case 409:
      res
        .status(409)
        .send({ message: 'Email is already taken.' });
      break;

    default:
      res
        .status(500)
        .send({ message: 'Internal server error.' });
      break;
  }
};

class ErrorHandler extends Error {
  constructor(code, message) {
    super();
    this.code = code;
    this.message = message;
  }
}

module.exports = { ErrorHandler, handleError };
