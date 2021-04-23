const router = require("express").Router();
const {
  getCards,
  createCard,
  deleteCardById,
  setCardLike,
  deleteCardLike,
} = require("../controllers/cards");

router.get("/", getCards);
router.delete("/:cardId", deleteCardById);
router.post("/", createCard);
router.put("/:cardId/likes", setCardLike);
router.delete("/:cardId/likes", deleteCardLike);

module.exports = router;
