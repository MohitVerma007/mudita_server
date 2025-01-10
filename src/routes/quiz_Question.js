const { Router } = require("express");
const {
  createQuestion,
  updateQuestionById,
  deleteQuestionById,
  getAllQuestionsForQuiz,
} = require("../controllers/quiz_Question");


// Uploader start


const configureUploader = require('../middlewares/uploader'); // Assuming you have the dynamic uploader middleware
const upload = configureUploader('../uploads/question'); // Define the path only once
// Set the dynamic upload path once for all routes

// Uploader end

const router = Router();


router.post("/create", upload.single('cover_img'), createQuestion);
router.put("/update/:id", upload.single('cover_img'), updateQuestionById);
router.get("/getAll/:quizId", getAllQuestionsForQuiz);
router.delete("/delete/:id", deleteQuestionById);

module.exports = router;
