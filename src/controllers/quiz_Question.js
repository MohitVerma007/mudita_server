const db = require("../../db.js");
const fs = require("fs");
const path = require("path");

// Create a new question
exports.createQuestion = async (req, res) => {
  const { quiz_id, question_text } = req.body;

  try {
    const query = `
      INSERT INTO Questions (quiz_id, question_text, cover_img)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    let cover_img = null;

    // Handle single cover image upload
    if (req.file) {
      const domain = process.env.DOMAIN; // Ensure you have a DOMAIN in your environment variables
      cover_img = `${domain}/uploads/question/${req.file.filename}`;
    }

    const { rows } = await db.query(query, [quiz_id, question_text, cover_img]);

    const createdQuestion = rows[0];
    return res.status(201).json({
      success: true,
      data: createdQuestion,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get all questions for a quiz
exports.getAllQuestionsForQuiz = async (req, res) => {
  const quizId = req.params.quizId;

  try {
    const query = "SELECT * FROM Questions WHERE quiz_id = $1";
    const { rows } = await db.query(query, [quizId]);
    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update question by ID
exports.updateQuestionById = async (req, res) => {
  const questionId = req.params.id;
  const { questionText } = req.body;

  try {
    const query = `
      UPDATE Questions
      SET question_text = $1, cover_img = $2
      WHERE question_id = $3
      RETURNING *;
    `;

    let cover_img = null;

    // Handle single cover image upload
    if (req.file) {
      const domain = process.env.DOMAIN; // Ensure you have a DOMAIN in your environment variables
      cover_img = `${domain}/uploads/question/${req.file.filename}`;
    }

    const { rows } = await db.query(query, [
      questionText,
      cover_img,
      questionId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Question not found",
      });
    }

    const updatedQuestion = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedQuestion,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Delete question by ID


exports.deleteQuestionById = async (req, res) => {
  const bannerId = req.params.id;

  try {
    const query = "DELETE FROM Questions WHERE question_id = $1 RETURNING *";
    const { rows } = await db.query(query, [bannerId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Questions not found",
      });
    }

    const deletedQuestion = rows[0];
    const coverImgUrl = deletedQuestion.cover_img; // Adjust to match your DB column name for the image URL

    // Remove the associated cover image file from the server
    if (coverImgUrl) {
      const filePath = path.join(
        __dirname,
        "../../uploads/question", // Adjust based on your upload folder structure
        path.basename(coverImgUrl)
      );

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting cover image file:", err.message);
        } else {
          console.log("Cover image file deleted successfully");
        }
      });
    }

    return res.status(200).json({
      success: true,
      is_deleted: "Successfully Deleted!",
      data: deletedQuestion,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

