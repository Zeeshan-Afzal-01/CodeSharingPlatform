import express from 'express';
import Team from '../models/team.js';
import User from '../models/user.js'
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Create a new team
router.post('/register', async (req, res) => {
  try {
    const { name, role, members, permissions,description } = req.body;

    
    if (!name || !role || !members || !description) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    
    const validRoles = ['developer', 'tester', 'manager'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

   
    if (permissions) {
      const { editCode, viewCode, comment } = permissions;
      
      if (typeof editCode !== 'boolean' || typeof viewCode !== 'boolean' || typeof comment !== 'boolean') {
        return res.status(400).json({ success: false, message: 'Invalid permissions data' });
      }
    }

   
    
    const newTeam = new Team({ name, role, members, permissions , description});
    await newTeam.save();

    res.status(201).json({ success: true, message: 'Team created successfully', data: newTeam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error creating team' });
  }
});

// Get all teams
router.get('/', verifyToken, async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json({ success: true, data: teams });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching teams' });
  }
});

// Get a team by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.find({members:req.params.id})
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    res.status(200).json({ success: true, data: team });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching team' });
  }
});

router.get('getTeam/:id', async (req, res) => {
  try {
    const team = await Team.find({_id:req.params.id})
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    res.status(200).json({ success: true, data: team });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching team' });
  }
});

// Update a team
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const data = req.body;
    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updatedTeam) return res.status(404).json({ success: false, message: 'Team not found' });
    res.status(200).json({ success: true, message: 'Team updated successfully', data: updatedTeam });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating team' });
  }
});

// Delete a team
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);
    if (!deletedTeam) return res.status(404).json({ success: false, message: 'Team not found' });
    res.status(200).json({ success: true, message: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting team' });
  }
});

export default router;
