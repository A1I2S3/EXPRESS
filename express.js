const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "aishwarya@reddy"; 


// MongoDB connection
mongoose.connect('mongodb+srv://aishureddy:root321@cluster0.dwoumuu.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token is missing' });
  }
  jwt.verify(token, JWT_SECRET, (decoded,err) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  });
};

// Create user endpoint
app.post('/api/users/create', async (req, res) => {
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
  app.post('/api/users/login', async (req, res) => {
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
      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Delete user endpoint
  app.delete('/api/users/:userId/delete', verifyToken, async (req, res) => {
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
  app.put('/api/users/:userId/update', verifyToken, async (req, res) => {
    try {
      const { userId } = req.params;
      const { username, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); // Using 10 salt rounds
      await User.findByIdAndUpdate(userId, { username, password: hashedPassword, role });
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
