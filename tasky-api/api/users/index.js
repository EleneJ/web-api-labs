import express from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from './userModel.js';

const router = express.Router();

// Get all users (for testing/dev)
router.get('/', async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Register or Authenticate user
router.post('/', asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, msg: 'Username and password are required.' });
    }

    if (req.query.action === 'register') {
      await registerUser(req, res);
    } else {
      await authenticateUser(req, res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: 'Internal server error.' });
  }
}));

// 🔐 REGISTER USER FUNCTION (password hashing handled in schema)
async function registerUser(req, res) {
  const { username, password } = req.body;

  const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      msg: "Password must be at least 8 characters long and include a letter, a digit, and a special character."
    });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ success: false, msg: 'Username already exists.' });
  }

  // Save user with plain password; schema will hash it
  const newUser = new User({ username, password });
  await newUser.save();

  res.status(201).json({ success: true, msg: 'User registered successfully.' });
}

// 🔐 AUTHENTICATE USER FUNCTION
async function authenticateUser(req, res) {
  const user = await User.findByUserName(req.body.username);
  if (!user) {
    return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
  }

  const isMatch = await user.comparePassword(String(req.body.password));
  if (isMatch) {
    const token = jwt.sign({ username: user.username }, process.env.SECRET);
    res.status(200).json({ success: true, token: 'BEARER ' + token });
  } else {
    res.status(401).json({ success: false, msg: 'Wrong password.' });
  }
}

export default router;