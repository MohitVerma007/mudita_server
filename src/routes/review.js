const { Router } = require("express");
const { createReview, updateReviewById, getReviewById, getAllReviews, deleteReviewById } = require("../controllers/review");


const router = Router();

router.post("/create", createReview);
router.put("/update/:id", updateReviewById);
router.get("/getbyId/:id", getReviewById);
router.get("/getAll", getAllReviews);
router.delete("/delete/:id", deleteReviewById);

module.exports = router;
