const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const expiresIn = '1h';
exports.createUser = async (req) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      const error= new Error('User already exists');
      error.code=409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Using 10 salt rounds

    const user = new User({
      username,
      password: hashedPassword,
      role
    });
    await user.save();

    return { message: 'User created successfully' };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

exports.loginUser = async (req) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      const error= new Error('User not found');
      error.code=404;
      throw error;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
       const error=new Error('Invalid password');
       error.code=401;
       throw error;
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn });
    return { token };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

exports.deleteUser = async (req) => {
  try {
    const { userId } = req.params;
    const user=await User.findByIdAndDelete(userId);
    if(!user)
    {
      const  error = new Error("User not Found");
      error.code=404;
      throw error;
    }
    return { message: 'User deleted successfully' };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

exports.updateUser = async (req) => {
  try {
    const { userId } = req.params;
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user=await User.findByIdAndUpdate(userId, { username, password: hashedPassword, role });
    if(!user)
    {
      const  error = new Error("User not Found");
      error.code=404;
      throw error;
    }
    return { message: 'User updated successfully' };
  } catch (error) {
    console.error(error);
    throw error;
  }
}