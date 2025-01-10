const { Router } = require("express");
const {
  createBlog,
  updateBlogById,
  getBlogById,
  getAllBlogs,
  deleteBlogById,
} = require("../controllers/blog");


// Uploader start


const configureUploader = require('../middlewares/uploader'); // Assuming you have the dynamic uploader middleware
const upload = configureUploader('../uploads/blog'); // Define the path only once
// Set the dynamic upload path once for all routes

// Uploader end


const router = Router();

//  Upload API
router.post("/create", upload.single('cover_img'), createBlog);

// Update
router.put("/update/:id", upload.single('cover_img'), updateBlogById);
// router.post("/update/:id", uploadMiddleware, updateBlogById);
router.get("/getbyId/:id", getBlogById);
router.get("/getAll", getAllBlogs);
router.delete("/delete/:id", deleteBlogById);

module.exports = router;
