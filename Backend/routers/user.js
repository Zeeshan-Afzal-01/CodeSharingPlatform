const express = require("express");
const User = require("../models/user");
const router = express.Router();
const passport=require("passport")
const bcrypt = require("bcrypt");  
const verifyToken=require('../middleware/verifyToken')


router.get("/user",verifyToken, (req, res) => {
  res.send("Hello User");
});

router.post("/register", async (req, res) => {
  try {
    const { fullname,username, password, email } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ success:false,message: "User already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullname,username, password:hashedPassword, email });
    newUser.save();

    res.status(200).json({success:true, message: "User Registered" });
  } catch (err) {
    err ? console.log(err) : console.log("No error");
  }
});



router.get('/login', (req,res,next)=>{
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
          return res.status(401).json({ success: false, message: info.message });
        }
        res.json({ success: true, token: info.token, message: `Welcome ${user.fullname}` });
    })(req,res,next)
    
})

module.exports = router;
