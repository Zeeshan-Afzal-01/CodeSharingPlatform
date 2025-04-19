import express from 'express';
import Meeting from '../models/meeting.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Create a new meeting
router.post('/create', async (req, res) => {
  try {
    const { title, date, team,time,createdBy } = req.body;
    const newMeeting = new Meeting({ title, date, team,time, createdBy });
    await newMeeting.save();
    res.status(201).json({ success: true, message: 'Meeting created successfully', data: newMeeting });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating meeting' });
  }
});

// Get all meetings
router.get('/', verifyToken, async (req, res) => {
  try {
    const meetings = await Meeting.find().populate('createdBy', 'fullname').populate('team');
    res.status(200).json({ success: true, data: meetings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching meetings' });
  }
});

// Get a meeting by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const meeting = await Meeting.find({createdBy:req.params.id})
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.status(200).json({ success: true, data: meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching meeting' });
  }
});


router.get('/teammeeting/:id', verifyToken, async (req, res) => {
  try {
    const meeting = await Meeting.find({team:req.params.id})
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.status(200).json({ success: true, data: meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching meeting' });
  }
});

// Update a meeting
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, date, team } = req.body;
    const updatedMeeting = await Meeting.findByIdAndUpdate(req.params.id, { title, date, team }, { new: true });
    if (!updatedMeeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.status(200).json({ success: true, message: 'Meeting updated successfully', data: updatedMeeting });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating meeting' });
  }
});

// Delete a meeting
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!deletedMeeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.status(200).json({ success: true, message: 'Meeting deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting meeting' });
  }
});

export default router;
