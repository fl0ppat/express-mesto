const router = require("express").Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserData,
  updateUserAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.patch("/me", updateUserData);
router.patch("/me/avatar", updateUserAvatar);

module.exports = router;
