const { Router } = require("express");
const { createTimeSlot, updateTimeSlotById, getTimeSlotsByMentorId, getAllTimeSlots, deleteTimeSlotById } = require("../controllers/time_slot");
const { createSlotRequest, updateSlotRequestStatusById, getSlotRequestsByMentorId, getAllSlotRequests, deleteSlotRequestById } = require("../controllers/slot_req");


const router = Router();

router.post("/create", createSlotRequest);
router.put("/update/:id", updateSlotRequestStatusById);
router.get("/getbyId/:id", getSlotRequestsByMentorId);
router.get("/getAll", getAllSlotRequests);
router.delete("/delete/:id", deleteSlotRequestById);

module.exports = router;
