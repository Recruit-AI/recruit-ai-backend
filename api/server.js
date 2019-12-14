const express = require('express');
const server = express();
require('dotenv').config();

const cors = require('cors');
server.use(cors());

server.use(express.json());

//A lot functionality for the core of the webapp, including users, logs, feedback, pages, and blog posts.
const coreRoutes = require('./core.js')
server.use('/api', coreRoutes)

server.get('/', (req, res) => {
  res.send("Your API is successfully connected");
})

module.exports = server;
