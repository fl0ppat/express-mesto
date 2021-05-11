class UnauthorizedError extends Error {
  constructor(message) {
    if (!message) {
      super('Указан неверный логин или пароль');
    } else {
      super(message);
    }

    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
