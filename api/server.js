const express = require('express');
const server = express();
require('dotenv').config();

const cors = require('cors');
server.use(cors());

server.use(express.json());
var twilio = require('twilio');

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

server.get('/test-message', (req, res) => {
  var accountSid = process.env.TWILIO_SID; // Your Account SID from www.twilio.com/console
  var authToken = process.env.TWILIO_TOKEN;   // Your Auth Token from www.twilio.com/console

  var client = new twilio(accountSid, authToken);

  client.messages.create({
    body: 'Hello from Node',
    to: '+12163167326',  // Text this number
    from: '+14155346398' // From a valid Twilio number
  })
  .then((message) => console.log(message.sid))
  .catch((err) => console.log(err))
})

const session = require('express-session');
const MessagingResponse = twilio.twiml.MessagingResponse;

server.use(session({secret: 'anything-you-want-but-keep-secret'}));

server.post('/sms', (req, res) => {
  const smsCount = req.session.counter || 0;

  let message = 'Hello, thanks for the new message.';

  if(smsCount > 0) {
    message = 'Hello, thanks for message number ' + (smsCount + 1);
  }

  req.session.counter = smsCount + 1;

  const twiml = new MessagingResponse();
  twiml.message(message);

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

module.exports = server;
