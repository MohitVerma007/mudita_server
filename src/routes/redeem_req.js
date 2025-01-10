const { Router } = require("express");
const { getRedeemReqById, getAllRedeemReqs, deleteRedeemReqById, updateRedeemReqById, createRedeemReq } = require("../controllers/redeem_req");


// Uploader start


const configureUploader = require('../middlewares/uploader'); // Assuming you have the dynamic uploader middleware
const upload = configureUploader('../uploads/redeem'); // Define the path only once
// Set the dynamic upload path once for all routes

// Uploader end
const router = Router();

//  Upload API
// router.post("/create", uploadMiddleware, async (req, res) => {
//   try {
//     // Ensure req.files is defined
//     if (!req.files) {
//       return res.status(400).json({ error: "No files uploaded." });
//     }

//     // Upload files to Firebase Storage
//     const fileUrls = await Promise.all(
//       Object.entries(req.files).map(async ([fieldName, files]) => {
//         if (!Array.isArray(files)) {
//           files = [files];
//         }

//         // Upload each file
//         const uploadedFiles = await Promise.all(
//           files.map(async (file) => {
//             try {
//               const dateTime = giveCurrentDateTime();
//               const storageRef = ref(
//                 storage,
//                 `Redeem/${file.originalname}_${dateTime}`
//               );

//               // Create file metadata including the content type
//               const metadata = {
//                 contentType: file.mimetype,
//               };

//               // Upload the file in the bucket storage
//               const snapshot = await uploadBytesResumable(
//                 storageRef,
//                 file.buffer,
//                 metadata
//               );

//               // Grab the public url
//               const downloadURL = await getDownloadURL(snapshot.ref);

//               return {
//                 fieldName,
//                 originalname: file.originalname,
//                 downloadURL,
//               };
//             } catch (error) {
//               console.error(`Error uploading ${fieldName}:`, error);
//               return null; // Handle the error as needed
//             }
//           })
//         );

//         return uploadedFiles.filter((file) => file !== null);
//       })
//     );

//     // Construct an object with file URLs
//     const formattedFileUrls = fileUrls.reduce((acc, files) => {
//       files.forEach((file) => {
//         acc[file.fieldName] = acc[file.fieldName] || [];
//         acc[file.fieldName].push({
//           originalname: file.originalname,
//           downloadURL: file.downloadURL,
//         });
//       });
//       return acc;
//     }, {});

//     await createRedeemReq(req, res, formattedFileUrls);
//   } catch (error) {
//     console.error("Error handling file uploads:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Update
router.put("/update/:id", upload.single('img'), updateRedeemReqById);
// router.post("/update/:id", uploadMiddleware, updateInstaById);
router.post("/create", createRedeemReq);
router.get("/getbyId/:id", getRedeemReqById);
router.get("/getAll", getAllRedeemReqs);
router.delete("/delete/:id", deleteRedeemReqById);


module.exports = router;
