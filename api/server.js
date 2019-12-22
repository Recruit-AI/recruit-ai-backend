const express = require('express');
const server = express();
require('dotenv').config();

const cors = require('cors');
server.use(cors());

server.use(express.json());


var twilio = require('twilio');
const bodyParser = require('body-parser');


const MessagingResponse = twilio.twiml.MessagingResponse;
server.use(bodyParser.urlencoded({ extended: false }));



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

server.post('/sms', (req, res) => {

  const twiml = new MessagingResponse();

  console.log(req.body.From, req.body.Body)

  if (req.body.Body.toLowerCase() == 'hello') {
    twiml.message('Hi! Your number is ' + req.body.From);
  } else if (req.body.Body.toLowerCase() == 'bye') {
    twiml.message('Goodbye' + req.body.From + "!");
  } else {
    twiml.message(
      "We're sorry, but we don't understand that command."
    );
  }

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});


module.exports = server;
