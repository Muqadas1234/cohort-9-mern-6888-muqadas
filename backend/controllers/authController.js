const { registerUser, loginUser } = require('../services/authService');
const logger = require('../config/logger');

const isValidString = (value) => typeof value === 'string' && value.trim().length > 0;

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!isValidString(name) || !isValidString(email) || !isValidString(password)) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await registerUser({ name: name.trim(), email: normalizedEmail, password });

    logger.info({ userId: user._id }, 'New user registered');

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!isValidString(email) || !isValidString(password)) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { user, token } = await loginUser({ email: normalizedEmail, password });

    logger.info({ userId: user._id }, 'User logged in');

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login };