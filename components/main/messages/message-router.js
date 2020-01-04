const express = require('express');
const router = express.Router();
const paginate = require('jw-paginate')

const Messages = require('./message-model.js');
const Alerts = require('../alerts/alert-model.js');

const { log } = require('../../core/administration/userLogs/log-middleware.js')
const authenticate = require('../../core/accounts/restricted-middleware.js')

var twilio = require('twilio');
const bodyParser = require('body-parser');
const MessagingResponse = twilio.twiml.MessagingResponse;
router.use(bodyParser.urlencoded({ extended: false }));
const {sendMessage} = require('./message-helper')

//Used to send from a coach to an athlete 
router.post('/send/:athlete_id', authenticate.team_restricted, async (req, res) => {
  const message_text = req.body.message_text
  const message_athlete_id = req.params.athlete_id
  const message_personnel_id = req.decodedToken.user.user_id
  const message_team_id = req.decodedToken.verified_team_id
  const message_type = "outgoing"

  const messageData = { message_text, message_team_id, message_athlete_id, message_personnel_id, message_type }

  const message = await Messages.add(messageData)

  sendMessage(message_text, message.user_display_name, message.phone)
  .then((m) => res.json(message))
  .catch((err) => res.status(400).json({message: err.message}))
  
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
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  } else { //IF it's a general message
    const message_team_id = athlete.team_id
    const message_athlete_id = athlete.athlete_id
    const message_personnel_id = athlete.recruiting_personnel_id
    const message_type = 'incoming'

    const messageData = { message_text, message_team_id, message_athlete_id, message_personnel_id, message_type }

    const message = await Messages.add(messageData)
    alert = await Alerts.addAlert(athlete.athlete_id, athlete.recruiting_personnel_id, "new-message")

    res.end()
  }


});

router.get('/team-summary', authenticate.team_restricted, (req, res) => {
  const team_id = req.decodedToken.verified_team_id

  Messages.getTeamSummary(team_id, req.query.month, req.query.year)
    .then(messages => {
      res.json(messages)
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get messages' });
    });
})

//Should return a list of users that has messages with them.
router.get('/', authenticate.team_restricted, (req, res) => {
  const user_id = req.decodedToken.user.user_id
  const team_id = req.decodedToken.verified_team_id

  const filter = req.query.filter || 'team'


  Messages.find(team_id, user_id, filter)
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
  const user_id = req.decodedToken.user.user_id
  const team_id = req.decodedToken.verified_team_id


  const filter = req.query.filter || 'team'

  const messages = await Messages.findByAthleteId(athlete_id, user_id, team_id, filter)
  if (messages) {
    // get page from query params or default to first page
    const page = parseInt(req.query.page) || 1;

    // get pager object for specified page
    const pageSize = 15;
    const pager = paginate(messages.length, page, pageSize);

    // get page of site_blogs from site_blogs array
    const pageOfItems = messages.slice(pager.startIndex, pager.endIndex + 1);

    // return pager object and current page of site_blogs
    return res.json({pager, pageOfItems});
  } else {
    res.status(404).json({ message: 'Could not find message with given id.' })
  }
});


module.exports = router;
