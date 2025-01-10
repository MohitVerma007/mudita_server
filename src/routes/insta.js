const { Router } = require("express");
const {
  createInsta,
  updateInstaById,
  getInstaById,
  getAllInstas,
  deleteInstaById,
  favInstaById,
} = require("../controllers/insta");



// Uploader start


const configureUploader = require('../middlewares/uploader'); // Assuming you have the dynamic uploader middleware
const upload = configureUploader('../uploads/insta'); // Define the path only once
// Set the dynamic upload path once for all routes

// Uploader end



const router = Router();

//  Upload API
router.post("/create", upload.single('img'), createInsta);
router.put("/update/:id", upload.single('img'), updateInstaById);


// router.post("/update/:id", uploadMiddleware, updateInstaById);
router.get("/getbyId/:id", getInstaById);
router.get("/getAll", getAllInstas);
router.delete("/delete/:id", deleteInstaById);
router.put("/fav/:id", favInstaById)


module.exports = router;
