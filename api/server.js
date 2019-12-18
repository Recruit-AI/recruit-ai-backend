const express = require('express');
const server = express();
require('dotenv').config();

const cors = require('cors');
server.use(cors());

server.use(express.json());

//A lot functionality for the core of the webapp, including users, logs, feedback, pages, and blog posts.
const coreRoutes = require('./core.js')
server.use('/api', coreRoutes)

const TeamRouter = require('../components/main/teams/team-router')
server.use('/api/teams', TeamRouter)

const AthleteRouter = require('../components/main/athletes/athlete-router')
server.use('/api/athletes', AthleteRouter)

const VisitRouter = require('../components/main/visits/visit-router')
server.use('/api/visits', VisitRouter)

const AlertRouter = require('../components/main/alerts/alert-router')
server.use('/api/alerts', AlertRouter)

server.get('/', (req, res) => {
  res.send("Your API is successfully connected");
})

module.exports = server;
