const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getAuthUser,
  createUser,
  updateUserData,
  updateUserAvatar,
  login,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getAuthUser);
router.get('/:id', getUserById);
router.patch('/me', updateUserData);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
module.exports.login = login;
module.exports.createUser = createUser;
