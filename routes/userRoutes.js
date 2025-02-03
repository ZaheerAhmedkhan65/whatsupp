const express = require('express');
const User = require('../models/Users');
const authenticate = require('../middleware/authMiddleware');

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
      const users = await User.searchByUsername(username);
      
      if (users.length === 0) {
        console.log("No users found matching:", username);
      } else {
        console.log("Users found:", users);
      }
  
      res.render('search-results', { users , token: req.query.token, userId: req.userId });
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ error: 'Error searching users' });
    }
  });
  
module.exports = router;