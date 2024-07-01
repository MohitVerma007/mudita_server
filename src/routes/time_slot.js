const { Router } = require("express");
const { createTimeSlot, updateTimeSlotById, getTimeSlotsByMentorId, getAllTimeSlots, deleteTimeSlotById } = require("../controllers/time_slot");


const router = Router();

router.post("/create", createTimeSlot);
router.put("/update/:id", updateTimeSlotById);
router.get("/getbyId/:id", getTimeSlotsByMentorId);
router.get("/getAll", getAllTimeSlots);
router.delete("/delete/:id", deleteTimeSlotById);

module.exports = router;
