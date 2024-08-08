const { Router } = require("express");
const { sendOtp, resetPasswordWithOtp } = require("../controllers/forgot_pwd");


const router = Router();

router.post("/sendOtp", sendOtp);
router.post("/resetPwd", resetPasswordWithOtp);

module.exports = router;
