const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt=require("bcrypt")
const User = require('../models/user');  
const jwt=require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET ;

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'User is not registered' });
      }

      
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password.' });
      }


     const token= jwt.sign({id:user._id,username:user.username},JWT_SECRET,{expiresIn:'1h'})
      return done(null, user,{token});
    } catch (error) {
      return done(error);
    }
  }
));



module.exports = passport;
