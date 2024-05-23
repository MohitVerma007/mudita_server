const { Router } = require("express");
const {
  menteeReq,
  mentorReqById,
  getSessionById,
  getAllSessions,
  deleteSessionById,
  completeSession,
} = require("../controllers/session");

const router = Router();

router.post("/mentee", menteeReq);
router.put("/mentor/:id", mentorReqById);
router.put("/complete/:id", completeSession);
router.get("/:id", getSessionById);
router.get("/", getAllSessions);
router.delete("/:id", deleteSessionById);

module.exports = router;
