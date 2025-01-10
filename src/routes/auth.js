const { Router } = require("express");
const {
  registerMentor,
  login,
  protected,
  logout,
  registerMentee,
  getAllMentees,
  getAllMentors,
  getMentorById,
  getMenteeById,
  updateMentorProfile,
  updateMenteeProfile,
  approveMentorProfile,
  deleteAllMentee,
  updateVisibility,
} = require("../controllers/auth");
const {
  validationMiddleware,
} = require("../middlewares/validations-middleware");
const { registerValidation, loginValidation } = require("../validators/auth");
const { userAuth } = require("../middlewares/auth-middleware");
const router = Router();

// Uploader start


const configureUploader = require('../middlewares/uploader'); // Assuming you have the dynamic uploader middleware
const upload = configureUploader('../uploads/user'); // Define the path only once
// Set the dynamic upload path once for all routes

// Uploader end


//  Register Mentor
router.post(
  "/registerMentor",
  upload.fields([
    { name: 'pancard_img', maxCount: 1 },
    { name: 'adharcard_front_img', maxCount: 1 },
    { name: 'adharcard_back_img', maxCount: 1 },
    { name: 'doctor_reg_cert_img', maxCount: 1 }
  ]),
  registerValidation,
  validationMiddleware,
 registerMentor
);

//  Update Mentor
router.put(
  "/updateMentor/:user_id",
  upload.fields([
    { name: 'profile_img', maxCount: 1 },
    { name: 'pancard_img', maxCount: 1 },
    { name: 'adharcard_front_img', maxCount: 1 },
    { name: 'adharcard_back_img', maxCount: 1 },
    { name: 'doctor_reg_cert_img', maxCount: 1 }
  ]),
  updateMentorProfile
);

// Get Routes
router.get("/getallMentees", getAllMentees);
router.get("/getallMentors", getAllMentors);
router.get("/getMentors/:user_id", getMentorById);
router.get("/getMentees/:user_id", getMenteeById);
router.get("/protected", userAuth, protected);
router.post("/login", loginValidation, validationMiddleware, login);
router.get("/logout", logout);
router.delete("/deleteAllMentee", deleteAllMentee);

// Register Mentee
router.post(
  "/registerMentee",
  registerValidation,
  validationMiddleware,
  registerMentee
);
// Update Mentee Profile
router.put(
  "/updateMentee/:user_id",
  upload.single('profile_img'),
 updateMenteeProfile
);

// Approve Mentor Profile
router.patch("/approveMentor/:user_id", approveMentorProfile);
router.patch("/updateVisibiity/:user_id", updateVisibility);

module.exports = router;
