const express = require('express');
const server = express();
const cors = require('cors');

const coreRoutes = require('./core.js')

server.use(cors());
server.use(express.json());
require('dotenv').config();

server.use('/api', coreRoutes)

server.get('/', (req, res) => {
  res.send("Your API is successfully connected");
})

module.exports = server;
