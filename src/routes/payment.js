const { Router } = require("express");
const { createPayment, getAllPayments } = require("../controllers/payment");
const { getAllSessions } = require("../controllers/session");


const router = Router();

router.post("/create", createPayment);
// router.put("/update/:id", updateTimeSlotById);
router.get("/getbyId/:id", getAllPayments);
router.get("/getAll", getAllTimeSlots);
router.delete("/delete/:id", deleteTimeSlotById);

module.exports = router;
