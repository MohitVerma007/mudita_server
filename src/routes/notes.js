const { Router } = require("express");
const {
  createNote,
  updateNoteById,
  getNoteById,
  getAllNote,
  deleteNoteById,
} = require("../controllers/notes");

const router = Router();

router.post("/create", createNote);
router.put("/update/:id", updateNoteById);
router.get("/getbyId/:id", getNoteById);
router.get("/getAll", getAllNote);
router.delete("/delete/:id", deleteNoteById);

module.exports = router;
