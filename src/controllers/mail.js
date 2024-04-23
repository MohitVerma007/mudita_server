const db = require("../../db.js");

const nodemailer = require("nodemailer");

exports.sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  // Create a transporter object using SMTP
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "mudita2024app@gmail.com",
      pass: "fybvgjignxrxthns",
    },
  });

  // Setup email data
  let mailOptions = {
    from: "mudita2024app@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  // Send mail with defined transport object
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.log("Error occurred:", error.message);
    res.status(500).send("Error sending email");
  }
};
