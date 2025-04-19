import cron from 'node-cron';
import User from '../models/user.js';  


const cleanupUnverifiedUsers = async () => {
  try {
    
    const expiredUsers = await User.find({
      otpExpire: { $lt: Date.now() }, 
      otpVerify: { $ne: null },      
    });

    
    for (const user of expiredUsers) {
      await User.deleteOne({ _id: user._id });
      console.log(`User with email ${user.email} removed due to expired OTP.`);
    }
  } catch (err) {
    console.error('Error during cleanup of unverified users:', err);
  }
};


cron.schedule('0 */1 * * *', cleanupUnverifiedUsers); // Runs every 1 hours 

export default cleanupUnverifiedUsers;