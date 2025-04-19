import express from 'express';
import Message from '../models/message.js';
import verifyToken from '../middleware/verifyToken.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/send', verifyToken, async (req, res) => { 
  try {
    const { sender,content, receiver, team, attachments, codeSnippet } = req.body;

    // Determine message type
    let messageType = 'direct';
    if (team) {
      messageType = 'team';
    }

    const newMessage = new Message({
      sender,
      receiver,
      team,
      content,
      attachments,
      codeSnippet,
      messageType
    });

    await newMessage.save();
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
});

// Handle both /message/:id and /message/user/:id
router.get(['/:id', '/user/:id'], verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    const messages = await Message.find({ 
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })   
      .populate('sender', 'fullname username profilePic _id')
      .populate('receiver', 'fullname username profilePic _id')
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      data: messages || [] 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching messages' 
    });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const updatedMessage = await Message.findByIdAndUpdate(req.params.id, { content }, { new: true });
    if (!updatedMessage) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, message: 'Message updated successfully', data: updatedMessage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating message' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMessage) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting message' });
  }
});

export default router;
