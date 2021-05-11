const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/Unauthorized');

/**
 * Cookie parser from
 * https://gist.github.com/rendro/525bbbf85e84fa9042c2
 */

module.exports = (req, res, next) => {
  try {
    const payload = jwt.verify(
      Object.fromEntries(req.headers.cookie.split('; ')
        .map((x) => x.split(/=(.*)$/, 2).map(decodeURIComponent)))._id,
      '12345',
    );
    req.user = payload;
  } catch {
    throw new UnauthorizedError('Необходима авторизация');
  }

  next();
};
