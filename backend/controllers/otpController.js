const nodemailer = require("nodemailer");
const User = require("../models/User"); // Mongoose model
const otpStore = new Map();

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // ✅ Return role so frontend can redirect appropriately
    return res.json({ message: "User exists", exists: true, role: existingUser.role });
  }

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

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent successfully", exists: false });
  } catch (err) {
    res.status(500).json({ message: "Email sending failed", error: err.toString() });
  }
};

exports.checkUserExists = async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });

  if (user) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
};


exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  const storedOtp = otpStore.get(email);
  if (storedOtp === otp) {
    otpStore.delete(email);

    let user = await User.findOne({ email });
    if (!user) {
      // ✅ Default role is "user"
      user = await User.create({ email, role: "user" });
    }

    res.json({
      message: "OTP verified successfully",
      success: true,
      role: user.role // ✅ Include role in response
    });
  } else {
    res.status(401).json({ message: "Invalid OTP", success: false });
  }
};
