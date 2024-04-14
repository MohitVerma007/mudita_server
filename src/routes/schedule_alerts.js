const { Router } = require("express");
const {
  deleteToolkitReminder,
  createToolkitReminder,
  updateToolkitReminder,
  getToolkitReminderById,
  getAllToolkitReminders,
} = require("../controllers/schedule_alert");
const router = Router();

router.post("/create", createToolkitReminder);
router.put("/update/:id", updateToolkitReminder);
router.get("/get/:id", getToolkitReminderById);
router.get("/getAll", getAllToolkitReminders);
router.delete("/delete/:id", deleteToolkitReminder);

module.exports = router;
