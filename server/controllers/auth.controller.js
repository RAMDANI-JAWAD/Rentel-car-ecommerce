const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret';

exports.register = async (req, res) => {
  const { email, password, profilePicture, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already exists.' });
    await User.create({ email, password, name: name || '', profilePicture: profilePicture || '', favorites: [] });
    res.json({ message: 'User registered successfully.' });
  } catch {
    res.status(500).json({ message: 'Registration failed.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      const token = jwt.sign(
        { email: user.email, profilePicture: user.profilePicture, name: user.name },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      return res.json({
        message: 'Login successful.',
        token,
        email: user.email,
        name: user.name || '',
        profilePicture: user.profilePicture || '',
      });
    }
    res.status(401).json({ message: 'Invalid email or password.' });
  } catch {
    res.status(500).json({ message: 'Login failed.' });
  }
};
