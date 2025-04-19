import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time:{
    type:String,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attended:{
    type:Boolean,
    default:false
  }
},{timestamps:true});

export default mongoose.model('Meeting', MeetingSchema);
