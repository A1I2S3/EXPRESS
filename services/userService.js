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
      throw new Error('User already exists');
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
      throw new Error('User not found');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
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
    await User.findByIdAndDelete(userId);
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
    await User.findByIdAndUpdate(userId, { username, password: hashedPassword, role });
    return { message: 'User updated successfully' };
  } catch (error) {
    console.error(error);
    throw error;
  }
}