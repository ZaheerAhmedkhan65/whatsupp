const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
require('dotenv').config();

const signup = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const userId = await User.create(username, hashedPassword);
    res.status(201).json({ message: 'User created', userId });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Fetch all users (except the logged-in user)
    const users = await User.findAllExcept(user.id);

    // Render the receiver selection page
    res.render('select-receiver', { token, users });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error during login' });
  }
};

const logout = (req, res) => {
  res.redirect('/auth/login');
};

module.exports = { signup, login, logout };