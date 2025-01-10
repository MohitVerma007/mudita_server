const { Router } = require("express");
const {
  createTechnique,
  updateTechniqueById,
  getTechniqueById,
  getAllTechniques,
  deleteTechniqueById,
} = require("../controllers/technique");

// Initialize Firebase

// const { initializeApp } = require("firebase/app");
// const {
//   getStorage,
//   ref,
//   getDownloadURL,
//   uploadBytesResumable,
// } = require("firebase/storage");
// const { firebaseConfig } = require("../config/firebase_config");
// const { config } = require("dotenv");
// config();

// const multer = require("multer");
// const path = require("path");

// // Initialize a firebase application
// initializeApp(firebaseConfig);
// // console.log(`api key of firebase is `, firebaseConfig.apiKey);

// // Initialize cloud storage and get a reference to the service
// const storage = getStorage();

// // Setting up multer as a middleware to grab photo uploads
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 28 * 1024 * 1024 },
// });

// // Middleware for handling file uploads
// const uploadMiddleware = upload.fields([
//   { name: "gif", maxCount: 1 },
//   { name: "music", maxCount: 1 },
//   { name: "cover_img", maxCount: 1 },
// ]);

// const giveCurrentDateTime = () => {
//   const today = new Date();
//   const date =
//     today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
//   const time =
//     today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//   const dateTime = date + " " + time;
//   return dateTime;
// };
const router = Router();



// Uploader start


const configureUploader = require('../middlewares/uploader'); // Assuming you have the dynamic uploader middleware
const upload = configureUploader('../uploads/technique'); // Define the path only once
// Set the dynamic upload path once for all routes

// Uploader end



//  Upload API
router.post("/create", upload.fields([
  { name: 'gif', maxCount: 1 },
  { name: 'music', maxCount: 1 },
  { name: 'cover_img', maxCount: 1 }
]), createTechnique);

// Update
router.put("/update/:id", upload.fields([
  { name: 'gif', maxCount: 1 },
  { name: 'music', maxCount: 1 },
  { name: 'cover_img', maxCount: 1 }
]), updateTechniqueById );

router.get("/getbyId/:id", getTechniqueById);
router.get("/getAll", getAllTechniques);
router.delete("/delete/:id", deleteTechniqueById);

module.exports = router;
