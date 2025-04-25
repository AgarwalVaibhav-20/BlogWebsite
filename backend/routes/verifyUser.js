const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Assuming you have a User model

router.post("/verification", async (req, res) => {
  try {
    const { verifyOTP } = req.body; // Extract OTP from request body
    console.log("Received OTP:", verifyOTP);
    // Find user by OTP
    const user = await User.findOne({ otp: verifyOTP });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    // Update isVerified field to true
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully", user });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
