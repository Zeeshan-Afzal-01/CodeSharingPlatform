import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  about:{
    type:String
  },
  skills:[{
  type:String
  }],
  bio:{
    type:String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
  },
  achievemnts:[{
    type:String
  }],
  password: {
    type: String,
    required: true,
  },
  location:{
    type:String
  },
  coverPic:{
    type:String,
  },
  profilePic:{
    type:String,
  },
  otpVerify:{
    type:String
  },
  otpExpire:{
    type:Date
  }
},{timestamps:true});


UserSchema.index({ otpExpire: 1 });
UserSchema.index({ otpVerify: 1 });


export default mongoose.model("User", UserSchema);
