const { Router } = require("express");

const {
  createSocialMedia,
  updateSocialMediaById,
  getSocialMediaById,
  getAllSocialMedia,
  deleteSocialMediaById,
} = require("../controllers/social_media");


const router = Router();



// Uploader start


const configureUploader = require('../middlewares/uploader'); // Assuming you have the dynamic uploader middleware
const upload = configureUploader('../uploads/media'); // Define the path only once
// Set the dynamic upload path once for all routes

// Uploader end

router.post("/create", upload.single('cover_img'), createSocialMedia);
router.put("/update/:id", upload.single('cover_img'), updateSocialMediaById);
router.get("/getbyId/:id", getSocialMediaById);
router.get("/getAll", getAllSocialMedia);
router.delete("/delete/:id", deleteSocialMediaById);

module.exports = router;
