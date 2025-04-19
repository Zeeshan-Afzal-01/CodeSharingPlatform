import express from 'express';
import User from '../models/user.js';
import passport from 'passport';
import bcrypt from 'bcrypt';
import verifyToken from '../middleware/verifyToken.js';
import upload from "../middleware/upload.js"
import verifyOTP from '../utils/verifyOtp.js';
import sendOtp from '../utils/sendOtp.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', verifyToken,async (req, res) => {
    try{
      const getData=await User.find().select('_id fullname  username email profilePic location'); 
      // console.log(getData)
      if(!getData) return res.status(201).json({message:"No User Found"})
      res.status(200).json({success:true,message:"Retieved All User Data",getData})

    }catch(err){
      console.log(err);
      res.status(400).json({success:false,message:"Failed to get all user data"})
    }
});


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};



router.post('/register', upload.single("profileImage"), async (req, res) => {
  try {
    const { fullname, username, password, email } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      
      return res.status(400).json({ success: false, message: 'User already registered' });
    }

    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      // Remove the uploaded image if the username is already taken
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, '..', req.file.path)); // Delete the image from the folder
      }
      return res.status(400).json({ success: false, message: 'Change Username and Try Again!' });
    }

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedOTP = await bcrypt.hash(otp, 10);

    const profilePicPath = req.file ? `uploads/${username}/${req.file.filename}` : null;

    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      email,
      profilePic: profilePicPath,
      otpVerify: hashedOTP,
      otpExpire: Date.now() + 10 * 60 * 1000,
    });

    await newUser.save();

    await sendOtp(email, otp);

    res.status(200).json({ success: true, message: 'User Registered' });
  } catch (err) {
    console.log(err || 'No error');
    // If error occurs, delete the image if it's uploaded
    if (req.file) {
      const filePath = path.join(__dirname, '..', req.file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



router.post("/verifyOTP",verifyOTP);


router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info?.message || "Authentication failed" });
    }

    
    const token = info?.token || jwt.sign({ id: user._id, username: user.username }, "hellomynameiszeeshan", { expiresIn: '1h' });

    res.json({ 
      success: true, 
      token  
    });
  })(req, res, next);
});


router.get('/me', verifyToken, async (req, res) => {
  try {
    const { username } = req.user; // Get username from token payload

    if (!username) {
      return res.status(400).json({ message: "Invalid token: No username found" });
    }

    const checkUser = await User.findOne({ username });

    if (!checkUser) {
      return res.status(400).json({ message: "User not registered!" });
    }

    res.status(200).json({ 
      email: checkUser.email, 
      profilePic: checkUser.profilePic, 
      username: checkUser.username,
      fullname: checkUser.fullname,
      id:checkUser._id,
      valid: true 
    });

  } catch (err) {
    console.log(err || 'No error');
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Username not received" });
    }

    const checkUser = await User.find({
      username: { $regex: `^${username}`, $options: 'i' }, // Case-insensitive search
    });

    if (checkUser.length === 0) {
      return res.status(400).json({ message: "No users found" });
    }

    res.status(200).json(checkUser); // Return the array of matching users
  } catch (err) {
    console.log(err || 'No error');
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/info/:id',async(req,res)=>{
  try {
    const { id } = req.params;


    if (!id) {
      return res.status(400).json({ message: "Username not received" });
    }

    
    const checkUser = await User.findById(id);

    res.status(200).json(checkUser); // Return the array of matching users
  } catch (err) {
    console.log(err || 'No error');
    res.status(500).json({ message: "Internal server error" });
  }
})

router.put('/:id', async (req, res) => {
  try {
    const  data = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: 'User Not Found' });
    res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating User' });
  }
});

// New route for updating profile image
router.put("/updateProfileImage/:userId/:username", upload.single("profileImage"), async (req, res) => {
    try {
        console.log("Update profile image request received");
        console.log("User ID:", req.params.userId);
        console.log("Username:", req.params.username);
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const user = await User.findById(req.params.userId);
        if (!user) {
            // Delete the uploaded file if user not found
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting file:", err);
            });
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Delete old profile picture if it exists
        if (user.profilePic) {
            const oldPath = path.join(process.cwd(), user.profilePic);
            console.log("Attempting to delete old file at:", oldPath);
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath, (err) => {
                    if (err) console.error("Error deleting old file:", err);
                });
            }
        }

        // Store relative path in database
        const relativePath = `uploads/${req.params.username}/${req.file.filename}`;
        console.log("Storing relative path:", relativePath);

        user.profilePic = relativePath;
        await user.save();

        res.json({
            success: true,
            message: "Profile picture updated successfully",
            imageUrl: relativePath
        });
    } catch (error) {
        console.error("Error updating profile picture:", error);
        // Delete the uploaded file if there's an error
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting file after error:", err);
            });
        }
        res.status(500).json({ 
            success: false, 
            message: "Error updating profile picture",
            error: error.message 
        });
    }
});

export default router;
