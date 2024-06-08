const { Router } = require("express");
const {
  createSOS,
  updateSOSById,
  getSOSById,
  getAllSOS,
  deleteSOSById,
} = require("../controllers/sos");

// Initialize Firebase

const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const { firebaseConfig } = require("../config/firebase_config");
const { config } = require("dotenv");
config();

const multer = require("multer");
const path = require("path");

// Initialize a firebase application
initializeApp(firebaseConfig);
// console.log(`api key of firebase is `, firebaseConfig.apiKey);

// Initialize cloud storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

// Middleware for handling file uploads
const uploadMiddleware = upload.fields([{ name: "video", maxCount: 1 }]);

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};
const router = Router();

//  Upload API
router.post("/create", createSOS);

// Update
router.put("/update/:id", updateSOSById);
router.get("/getbyId/:id", getSOSById);
router.get("/getAll", getAllSOS);
router.delete("/delete/:id", deleteSOSById);

module.exports = router;
