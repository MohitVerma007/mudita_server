const { Router } = require("express");
const { createFee, updateFeeById, getFeeById, getAllFees, deleteFeeById } = require("../controllers/fees");


const router = Router();

router.post("/create", createFee);
router.put("/update/:id", updateFeeById);
router.get("/getbyId/:id", getFeeById);
router.get("/getAll", getAllFees);
router.delete("/delete/:id", deleteFeeById);

module.exports = router;
