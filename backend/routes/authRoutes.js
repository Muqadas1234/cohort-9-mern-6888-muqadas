const express = require('express');
const { signup, login } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'You are authenticated!',
    userId: req.userId,
  });
});

module.exports = router;