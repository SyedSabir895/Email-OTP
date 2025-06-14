const nodemailer = require("nodemailer");

const otpStore = new Map();

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp); // Store OTP

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
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Email send failed:", err);
    res.status(500).json({ message: "Error sending email", error: err.toString() });
  }
};

exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

  const storedOtp = otpStore.get(email);
  if (storedOtp === otp) {
    otpStore.delete(email); // Optional: remove after use
    res.json({ message: "OTP verified successfully", success: true });
  } else {
    res.status(401).json({ message: "Invalid or expired OTP", success: false });
  }
};
