const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already in use');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error('Email already in use');
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
};

module.exports = { registerUser, loginUser };