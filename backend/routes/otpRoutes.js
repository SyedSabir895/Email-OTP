const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp } = require('../controllers/otpController');

// Route to send OTP to email
router.post('/send', sendOtp);

// Route to verify OTP
router.post('/verify', verifyOtp);

module.exports = router;
