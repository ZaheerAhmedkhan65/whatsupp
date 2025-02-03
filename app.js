const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const path = require('path');

const app = express();

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRoutes);
app.use('/messages', messageRoutes);

// Home route
app.get('/',  (req, res) => {
  res.render('index'); // Render the index.ejs file
});

app.get('*', (req, res) => {
  res.status(404).render('notfound');
});

module.exports = app;