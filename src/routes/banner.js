const { Router } = require("express");
const {
  createBanner,
  updateBannerById,
  getBannerById,
  getAllBanners,
  deleteBannerById,
} = require("../controllers/banner");

const router = Router();


// Uploader start


const configureUploader = require('../middlewares/uploader'); // Assuming you have the dynamic uploader middleware
const upload = configureUploader('../uploads/banner'); // Define the path only once
// Set the dynamic upload path once for all routes

// Uploader end

router.post("/create", upload.single('cover_img'), createBanner);
router.put("/update/:id", upload.single('cover_img'), updateBannerById);

router.get("/getbyId/:id", getBannerById);
router.get("/getAll", getAllBanners);
router.delete("/delete/:id", deleteBannerById);

module.exports = router;
