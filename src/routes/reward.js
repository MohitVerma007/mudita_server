const { Router } = require("express");
const { createReward, updateRewardById, getRewardsByMentorId, getAllRewards, deleteRewardById } = require("../controllers/rewards");


const router = Router();

router.post("/create", createReward);
router.put("/update/:id", updateRewardById);
router.get("/getbyId/:id", getRewardsByMentorId);
router.get("/getAll", getAllRewards);
router.delete("/delete/:id", deleteRewardById);

module.exports = router;
