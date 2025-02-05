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
       // Get all users except the current user
       let users = await User.findAllExcept(req.userId);

       // Filter users based on the search query
       users = users.filter(user => user.username.toLowerCase().includes(username.toLowerCase()));
      let friendRequests = await FriendRequest.findByReceiverId(req.userId);
      let currentUser = await User.findByUserId(req.userId);
      const friends = await FriendRequest.getFriends(req.userId);
      if (users.length === 0) {
        console.log("No users found matching:", username);
      } else {
        console.log("Users found:", users);
      }
  
      res.render('search-results', { users , token: req.query.token, userId: req.userId, friends, friendRequests, currentUser });
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ error: 'Error searching users' });
    }
  });

  router.get('/select-receiver', authenticate, async (req, res) => {
    try {
      console.log('UserId:', req.userId);
      // Fetch users excluding the logged-in user
      const users = await User.findAllExcept(req.userId);
      const currentUser = await User.findByUserId(req.userId);
  
      // Fetch friend requests for the logged-in user
      const friendRequests = await FriendRequest.findByReceiverId(req.userId);
  
      // Fetch friends of the logged-in user
      const friends = await FriendRequest.getFriends(req.userId);
  
      // Render select-user page
      res.render('select-receiver', { 
        users, 
        currentUser,
        friendRequests, 
        friends, 
        token: req.query.token 
      });
  
    } catch (error) {
      console.error('Error fetching select-user data:', error);
      res.status(500).json({ error: 'Error loading select-user page' });
    }
  });

  router.get('/profile',authenticate,async (req, res) => {
        try {
          const currentUser = await User.findByUserId(req.userId);
          const friends = await FriendRequest.getFriends(req.userId);
          res.render('profile',{
            currentUser,
            friends,
            token: req.query.token
          })
        } catch (error) {
          console.error("error fetching user data :", error);
          res.status(500).json({error: "Error loading user profile page"})
        }
  });


module.exports = router;