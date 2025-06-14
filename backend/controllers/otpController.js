const nodemailer = require("nodemailer");
const User = require("../models/User");

const otpStore = new Map();

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      // Returning user – skip OTP
      return res.json({ message: "Returning user", skipOtp: true, success: true });
    }

    // New or unverified user
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent successfully", skipOtp: false, success: true });
  } catch (err) {
    console.error("Email send failed:", err);
    res.status(500).json({ message: "Error sending email", error: err.toString(), success: false });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

  const storedOtp = otpStore.get(email);
  if (storedOtp !== otp) {
    return res.status(401).json({ message: "Invalid or expired OTP", success: false });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, isVerified: true });
    } else {
      user.isVerified = true;
    }

    await user.save();
    otpStore.delete(email); // Clean up OTP

    res.json({ message: "OTP verified, user logged in", success: true });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
