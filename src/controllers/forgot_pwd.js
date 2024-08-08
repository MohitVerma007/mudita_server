const db = require("../../db.js");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { hash } = require("bcryptjs");

// const { PORT, CLIENT_URL } = require("./constants");

const { SMTP_MAIL, SMTP_PASSWORD } = require("../constants");


exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (!user.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP in the database
    await db.query(
      "INSERT INTO password_resets(email, token) VALUES($1, $2)",
      [email, otp]
    );

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service
      auth: {
        user: SMTP_MAIL, // Your email
        pass: SMTP_PASSWORD   // Your email password
      }
    });

    const mailOptions = {
      to: email,
      from: SMTP_MAIL,
      subject: 'Password Reset OTP',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Your OTP for password reset is: ${otp}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP has been sent to your email' });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};



exports.resetPasswordWithOtp = async (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    try {
      // Find the OTP in the database
      const result = await db.query(
        "SELECT * FROM password_resets WHERE email = $1 AND token = $2",
        [email, otp]
      );
  
      if (!result.rows.length) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }
  
      // Hash the new password
      const hashedPassword = await hash(newPassword, 10);
  
      // Update the user's password
      await db.query(
        "UPDATE users SET password = $1 WHERE email = $2",
        [hashedPassword, email]
      );
  
      // Delete the OTP
      await db.query("DELETE FROM password_resets WHERE email = $1", [email]);
  
      res.status(200).json({ message: 'Password has been reset' });
  
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  };
  