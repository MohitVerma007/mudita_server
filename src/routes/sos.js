const { Router } = require("express");
const {
  createSOS,
  updateSOSById,
  getSOSById,
  getAllSOS,
  deleteSOSById,
} = require("../controllers/sos");


const { config } = require("dotenv");
config();

const router = Router();

//  Upload API
router.post("/create", createSOS);

// Update
router.put("/update/:id", updateSOSById);
router.get("/getbyId/:id", getSOSById);
router.get("/getAll", getAllSOS);
router.delete("/delete/:id", deleteSOSById);

module.exports = router;
