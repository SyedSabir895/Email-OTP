import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Login() {
  const [step, setStep] = useState("form");
  const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/otp/send", { email });
      setStep("otp");
      alert("OTP sent to your email");
    } catch (err) {
      alert("Error sending OTP");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/otp/verify", { email, otp });
      if (res.data.success) {
        navigate("/welcome"); 
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      alert("OTP verification failed");
    }
  };

  return (
    <div>
      <h2>{step === "form" ? "Login" : "Verify OTP"}</h2>
      {step === "form" ? (
        <form onSubmit={sendOtp}>
          <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
          {/*<input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} /> */}
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={verifyOtp}>
          <input type="text" placeholder="Enter OTP" value={otp} required onChange={(e) => setOtp(e.target.value)} />
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
}

export default Login;
