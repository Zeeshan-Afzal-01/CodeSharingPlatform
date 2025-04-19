import User from "../models/user.js";
import bcrypt from "bcrypt"

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found" });
  
      if (Date.now() > user.otpExpire) return res.status(400).json({ message: "OTP expired" });
  
      const isMatch = await bcrypt.compare(otp, user.otpVerify);
      if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });
  
      user.otpVerify = null; 
      user.otpExpire = null;
      await user.save();
  
      res.status(200).json({success:true, message: "OTP verified successfully. Registration complete." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
export default verifyOTP;