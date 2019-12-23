const express = require('express');
const router = express.Router();

const Messages = require('./message-model.js');

const { log } = require('../../core/administration/userLogs/log-middleware.js')
const authenticate = require('../../core/accounts/restricted-middleware.js')

var twilio = require('twilio');
const bodyParser = require('body-parser');
const MessagingResponse = twilio.twiml.MessagingResponse;
router.use(bodyParser.urlencoded({ extended: false }));
const twilioPhoneNumber = "+14155346398"

//Used to send from a coach to an athlete 
router.post('/send/:athlete_id', authenticate.team_restricted, async (req, res) => {
  const message_text = req.body.message
  const message_athlete_id = req.params.athlete_id
  const message_personnel_id = req.decodedToken.user.user_id
  const message_team_id = req.decodedToken.verified_team_id
  const message_type = "outgoing"

  const messageData = { message_text, message_team_id, message_athlete_id, message_personnel_id, message_type }

  const message = await Messages.add(messageData)

  var client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

  client.messages.create({
    body: message_text + " -" + message.user_display_name, //The message with the coach's name appended 
    to: '+1' + message.phone,  //The athletes number
    from: twilioPhoneNumber //Our twilio phone #
  })
    .then((m) => res.json(message))
    .catch((err) => console.log(err))
})

//The WebHook called by twilio when an athlete texts in
//Use cases- text "help" to get a list of these options
//Text "visit" to get the status on the visit- it either sends the date/information, or the choose link again
//Text "recruiter" to get the information of your recruiter
//Text "information" to get a general overview of the app- "RecruitAI is an app that allows you the convience of just using your phone."

router.post('/sms', async (req, res) => {
  const twiml = new MessagingResponse();

  const incomingNumber = req.body.From
  const athlete = await Messages.findAthleteByNumber(incomingNumber)
  //throw error if number not there

  const options = ['options', 'visit', 'recruiter', 'information']
  const message_text = req.body.Body

  if (options.indexOf(message_text.toLowerCase()) >= 0) { //IF it's one of the help options
    switch (message_text.toLowerCase()) {
      case "options":
        twiml.message('Hi! Your options are ' + req.body.From);
        break;
      case "visit":
        twiml.message('Hi! Your next visit is ' + req.body.From);
        break;
      case "recruiter":
        twiml.message('Hi! Your recruiter is ' + req.body.From);
        break;
      case "information":
        twiml.message('Hi! This application is ' + req.body.From);
        break;
      default:
        break;
    }
  } else { //IF it's a general message
    twiml.message("We'll pass that message along.");
    const message_team_id = athlete.team_id
    const message_athlete_id = athlete.athlete_id
    const message_personnel_id = athlete.recruiting_personnel_id
    const message_type = 'incoming'

    const messageData = { message_text, message_team_id, message_athlete_id, message_personnel_id, message_type }

    const message = await Messages.add(messageData)
  }


  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});


//Should return a list of users that has messages with them.
router.get('/', authenticate.team_restricted, (req, res) => {
  const user = req.decodedToken.user
  const user_id = req.decodedToken.user.user_id
  const team_id = req.decodedToken.verified_team_id

  const status = req.query.status || 'all'
  const filter = req.query.filter || 'team'


  Messages.find(team_id, user_id, status, filter)
    .then(messages => {
      res.json(messages)
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get messages' });
    });
})

//This should return all of the messages for a particular athlete
router.get('/:athlete_id', authenticate.team_restricted, async (req, res) => {
  const { athlete_id } = req.params;

  const message = await Messages.findByAthleteId(athlete_id)
  if (message) {
    res.json(message)
  } else {
    res.status(404).json({ message: 'Could not find message with given id.' })
  }
});


module.exports = router;
