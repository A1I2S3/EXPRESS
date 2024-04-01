const express=require('express');
const routes=express.Router();
const JWT_SECRET = process.env.JWT_SECRET; 
const expiresIn='1h';
const User=require('../models/user.js');
const { verifyToken }= require('../middleware/verifytoken.js');
const bcrypt=require( 'bcryptjs');
const jwt=require('jsonwebtoken');
routes.post('/api/users/create', async (req, res) => {
    try {
      const { username, password, role } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10); // Using 10 salt rounds
  
      // Create user
      const user = new User({
        username,
        password:hashedPassword,
        role
      });
      await user.save();
  
      res.json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Login endpoint
routes.post('/api/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET,{expiresIn});
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user endpoint
routes.delete('/api/users/:userId/delete', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user endpoint
routes.put('/api/users/:userId/update', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 
    await User.findByIdAndUpdate(userId, { username, password: hashedPassword, role });
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports=routes;