const jwt = require('jsonwebtoken');

/**
 * Cookie parser from
 * https://gist.github.com/rendro/525bbbf85e84fa9042c2
 */

module.exports = (req, res, next) => {
  let token;
  try {
    token = Object.fromEntries(req.headers.cookie.split('; ').map((x) => x.split(/=(.*)$/, 2).map(decodeURIComponent)))._id;
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, '12345');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;

  return next();
};
