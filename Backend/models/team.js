import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["developer", "tester", "manager"],
    required: true,
  },
  permissions: {
    editCode: {
      type: Boolean,
      default: false,
    },
  description:{
    type:String
  },
  status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    viewCode: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: Boolean,
      default: false,
    },
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }],
}, { timestamps: true });

export default mongoose.model('Team', TeamSchema);
