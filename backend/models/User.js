const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  otp: { type: String },
  isVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["superadmin", "admin", "employee", "user"],
    default: "user"
  }
});

module.exports = mongoose.model("User", userSchema);
