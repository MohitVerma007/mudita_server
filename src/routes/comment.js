const { Router } = require("express");
const {
  createComment,
  updateCommentById,
  getCommentById,
  getAllComments,
  deleteCommentById,
} = require("../controllers/comment");

const router = Router();

router.post("/create", createComment);
router.put("/update/:id", updateCommentById);
router.get("/getById/:id", getCommentById);
router.get("/getAll", getAllComments);
router.delete("/delete/:id", deleteCommentById);

module.exports = router;
