import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { motion } from "framer-motion";
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
import "./otp.css";

const OTPVerification = () => {
    const location = useLocation();
    const email = location.state?.email || ""; // Get email from navigation state
const navigate=useNavigate();
    const [otp, setOtp] = useState("");

    const handleVerify = async () => {

        if (otp.length === 6) {
            try {
                const response = await axios.post("http://localhost:3002/users/verifyOTP", {
                    email,
                    otp
                });
                alert(response.data.message); // Show success or failure message
                if(response.data.success==true)
                {
                    navigate("/login")
                }
            } catch (error) {
                alert("Invalid OTP. Please try again.");
                console.error("OTP Verification Error:", error);
            }
        } else {
            alert("Please enter a valid 6-digit OTP");
        }
    };

    return (
        <div className="otp-container">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="otp-card"
            >
                <motion.img
                    src="https://i.gifer.com/WFH.gif"
                    alt="OTP Animation"
                    className="otp-animation"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ yoyo: Infinity, duration: 1.5 }}
                />

                <h2>Enter OTP</h2>
                <p>We've sent a 6-digit OTP to <strong>{email}</strong>.</p>

                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderInput={(props) => <input {...props} />}
                    shouldAutoFocus
                    containerStyle="otp-inputs"
                    inputStyle="otp-input"
                />
                
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="verify-btn"
                    onClick={handleVerify}
                >
                    Verify OTP
                </motion.button>
            </motion.div>
        </div>
    );
};

export default OTPVerification;
