const { Router } = require("express");
const { sendEmail } = require("../controllers/mail");

const router = Router();

router.post("/send", sendEmail);

module.exports = router;
