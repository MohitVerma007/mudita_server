const { Router } = require("express");
const {
  postJournalEntry,
  getAllJournalEntries,
} = require("../controllers/journal");

const router = Router();

router.post("/create", postJournalEntry);
router.get("/getAll", getAllJournalEntries);
module.exports = router;
