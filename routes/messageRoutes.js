const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const { getMessages, sendMessage, updateMessage, deleteMessage } = require('../controllers/messageController');
const User = require('../models/Users'); // Import the User model

const router = express.Router();

// Render the chat page (protected route)
router.get('/chat', authenticate, async (req, res) => {
  const { receiverId } = req.query;
  if (!receiverId) {
    return res.status(400).json({ error: 'Receiver ID is required' });
  }
  try {
    // Fetch messages
    const messages = await getMessages(req, res);

    // Fetch receiver's username
    const receiver = await User.findByUserId(receiverId); // Add this method to the User model
    const receiverUsername = receiver ? receiver.username : 'Unknown';
    const users = await User.findAllExcept(req.userId);
    // Get the token from the query parameters
    const token = req.query.token;

    res.render('chat', {
      userId: req.userId,
      receiverId,
      receiverUsername,
      messages: messages || [],
      token,
      users
    });
  } catch (error) {
    console.error('Error rendering chat page:', error);
    res.status(500).json({ error: 'Error rendering chat page' });
  }
});

router.post('/send', authenticate, sendMessage);

module.exports = router;