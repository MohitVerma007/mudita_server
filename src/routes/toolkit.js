const { Router } = require("express");


const {
  createToolkit,
  updateToolkitById,
  getToolkitById,
  getAllToolkits,
  deleteToolkitById,
  toolkitStep,
  getPerformanceById,
  getAllPerformance,
  deletePerformanceById,
  starttoolkitStep,
  updatetoolkitStep,
  finishtoolkitStep,
  skiptoolkitStep,
} = require("../controllers/toolkit");


const router = Router();



// Uploader start


const configureUploader = require('../middlewares/uploader'); // Assuming you have the dynamic uploader middleware
const upload = configureUploader('../uploads/toolkit'); // Define the path only once
// Set the dynamic upload path once for all routes

// Uploader end

router.post("/create", upload.single('cover_img'), createToolkit);
router.put("/update/:id", upload.single('cover_img'), updateToolkitById);

router.get("/getbyId/:id", getToolkitById);
router.get("/getAll", getAllToolkits);
router.delete("/delete/:id", deleteToolkitById);

// Next Step in Toolkit
router.post("/startToolkit", starttoolkitStep);
router.post("/nextToolkitstep", updatetoolkitStep);
router.post("/finishToolkitstep", finishtoolkitStep);
router.post("/skipToolkitstep", skiptoolkitStep);

router.get("/scorebyId/:id", getPerformanceById);
router.get("/getAllscore", getAllPerformance);
router.delete("/deleteScore/:id", deletePerformanceById);

module.exports = router;
