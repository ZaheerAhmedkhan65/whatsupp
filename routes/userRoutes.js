const express = require('express');
const User = require('../models/Users');
const authenticate = require('../middleware/authMiddleware');
const FriendRequest = require('../models/FriendRequest');

const router = express.Router();

// Search users by username
router.get('/search', authenticate, async (req, res) => {
    const { username } = req.query;
  
    if (!username) {
      console.log("No username provided for search");
      return res.status(400).json({ error: 'Username is required for search' });
    }
  
    try {
      console.log("Received search request for:", username);
       // Get all users except the current user
       let users = await User.findAllExcept(req.userId);

       // Filter users based on the search query
       users = users.filter(user => user.username.toLowerCase().includes(username.toLowerCase()));

      const friends = await FriendRequest.getFriends(req.userId);
      if (users.length === 0) {
        console.log("No users found matching:", username);
      } else {
        console.log("Users found:", users);
      }
  
      res.render('search-results', { users , token: req.query.token, userId: req.userId, friends });
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ error: 'Error searching users' });
    }
  });
  
module.exports = router;