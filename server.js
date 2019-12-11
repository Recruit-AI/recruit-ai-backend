const express = require('express');
const server = express();
const cors = require('cors');
server.use(cors());
server.use(express.json());
require('dotenv').config();



//User Information
//User & auth information
const UserRouter = require('./components/users/user-router.js');
server.use('/api/users', UserRouter);

//These are the routes for logs, sources, and images, providing much of the supporting data.
const LogRouter = require('./components/userLogs/log-router.js');
server.use('/api/logs', LogRouter);

//Log all creates & edits with the user who did so. Ability to view logs & undo changes.
const FeedbackRouter = require('./components/feedback/feedback-router.js');
server.use('/api/feedback', FeedbackRouter);

//Thumbnail & image gallery functionality.
const ImageRouter = require('./components/images/image-router.js');
server.use('/api/images', ImageRouter);



server.get('/', (req, res) => {
  res.send("Your API is successfully connected");
})

module.exports = server;
