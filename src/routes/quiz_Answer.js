const { Router } = require("express");
const {
  saveUserAnswersBulk,
  getUserScores,
} = require("../controllers/quiz_Answer");

const router = Router();

router.post("/save", saveUserAnswersBulk);
router.get("/score/:user_id/:quiz_id", getUserScores);

module.exports = router;
