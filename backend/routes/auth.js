import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../schema/User.js';
import auth from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Email and password are required' 
      });
    }

    // Find user with password explicitly selected
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Invalid credentials' 
      });
    }

    // Verify password exists in user document
    if (!user.password) {
      console.error('User account missing password field:', user._id);
      return res.status(500).json({
        status: 'error',
        message: 'Account configuration error'
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Invalid credentials' 
      });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({
      status: 'success',
      token,
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});
router.get('/me', auth, async (req, res) => {
  try {
    // Get full user document
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }

    res.json({
      status: 'success',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
        // Add any other fields you need
      }
    });
  } catch (error) {
    console.error('Error in /me endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});
router.get("/allusers", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, __v: 0 }); // exclude password & version
    res.status(200).json({ status: "success", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ status: "failed", message: "Failed to fetch users" });
  }
});
router.get('/usercount', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/logout', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'Logged out successfully' 
  });
});
// Simple delete without any authentication
router.delete('/deleteuser/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting user'
    });
  }
});
// Add this to your auth routes (just before export default router)
router.put('/status/:userId', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const { userId } = req.params;

    // Validate input
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status value'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Update status and related timestamps
    await user.updateStatus(status);

    res.status(200).json({
      status: 'success',
      message: 'User status updated',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        lastActive: user.lastActive,
        lastLogin: user.lastLogin,
        lastLogout: user.lastLogout
      }
    });

  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user status'
    });
  }
});
export default router;
