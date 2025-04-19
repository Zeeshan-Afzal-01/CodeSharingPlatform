import mongoose from 'mongoose';

const CodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},{timestamps:true});

export default mongoose.model('Code', CodeSchema);
