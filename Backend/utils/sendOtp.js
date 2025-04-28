import nodemailer from "nodemailer"

const sendOtp=async(email,otp)=>{
try{
const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "465",
   service: "gmail",
    auth: {
      user: "Enter you email",
      pass: "Enter your pass",
}})

const mailOptions={
    from:"zaservices6@gmail.com",
    to:email,
    subject: "Your OTP for Verification",
    text: `Thank you for registering with CodeSharingPlatform! To complete your registration, please use the One-Time Password (OTP) below:

🔑 Your OTP: ${otp}

This OTP is valid for 10 minutes. Please do not share it with anyone for security reasons.

If you did not request this, please ignore this email.

Best regards,
codeSharingPlatform
Zeeshan Afzal`,
}


await transport.sendMail(mailOptions)
console.log("OTP sent to email successfully.");

}catch(err){
console.log(err);
}
}

export default sendOtp;
