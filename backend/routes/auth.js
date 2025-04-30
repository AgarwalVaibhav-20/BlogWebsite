import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import User from "../models/user.js";
import {nanoid} from "nanoid";
import jwt from "jsonwebtoken";
import validator from "validator";

// Format user response
const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY,
    {
      expiresIn: "7d",
    }
  );

  return {
    access_token,
    profilePhoto: user.profilePhoto,
    username: user.username,
    fullname: user.fullname,
  };
};

// Generate unique username
const generateUsername = async (email) => {
  let base = email.split("@")[0];
  let username = base;
  while (await User.exists({ username })) {
    username = base + nanoid(5);
  }
  return username;
};

// ========== SIGN UP ==========
router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    const username = await generateUsername(email);

    const newUser = await User.create({
      fullname,
      email,
      password,
      username,
      verifyOTP: otp,
      otpExpiry,
    });

    // ✅ Always log OTP (even in production)
    console.log(`✅ OTP for ${email}: ${otp}`);

    return res.status(201).json({
      message: "User registered. OTP sent to email.",
      user: formatDatatoSend(newUser),
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ========== VERIFY OTP ==========
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || user.verifyOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.verifyOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({
      message: "Account verified successfully",
      user: formatDatatoSend(user),
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// ========== RESEND OTP ==========
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.verifyOTP = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    if (process.env.NODE_ENV !== "production") {
      console.log(`🔁 Resent OTP for ${email}: ${otp}`);
    }

    res.status(200).json({ message: "OTP resent to email" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// ========== SIGN IN ==========
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    return res.status(200).json({
      message: "Logged in successfully",
      user: formatDatatoSend(user),
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
