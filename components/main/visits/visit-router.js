const express = require('express');
const router = express.Router();

const Visits = require('./visit-model.js');
const Alerts = require('../alerts/alert-model.js');
const Athletes = require('../athletes/athlete-model.js');

const { log } = require('../../core/administration/userLogs/log-middleware.js')
const authenticate = require('../../core/accounts/restricted-middleware.js')


var twilio = require('twilio');
const bodyParser = require('body-parser');
const MessagingResponse = twilio.twiml.MessagingResponse;
router.use(bodyParser.urlencoded({ extended: false }));
const { sendMessage } = require('../messages/message-helper')



router.get('/', authenticate.team_restricted, (req, res) => {
  const user = req.decodedToken.user
  const user_id = req.decodedToken.user.user_id
  const team_id = req.decodedToken.verified_team_id

  const status = req.query.status || 'all'
  const filter = req.query.filter || 'team'


  Visits.find(team_id, user_id, status, filter)
    .then(visits => {
      res.json(visits)
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get visits' });
    });
})

//The private route to see all the details
router.get('/:id', authenticate.team_restricted, async (req, res) => {
  const { id } = req.params;

  const visit = await Visits.findById(id)
  if (visit) {
    res.json(visit)
  } else {
    res.status(404).json({ message: 'Could not find visit with given id.' })
  }

});

//The public route to get the general info for the athlete to see
router.get('/public/:id', async (req, res) => {
  const { id } = req.params;

  const visit = await Visits.findPublicById(id)
  if (visit) {
    res.json(visit)
  } else {
    res.status(404).json({ message: 'Could not find visit with given id.' })
  }

});

router.post('/', authenticate.team_restricted, async (req, res) => {
  const visitData = req.body;
  visitData.visit_status = 'pending'

  let visit = await Visits.add(visitData)

  let text = `You have a new School Visit Confirmation from ${visit.user_display_name}. 
  Please click this link to choose your option: https://recruit-ai.netlify.com/visits/${visit.visit_id}/choose`

  sendMessage(text, "RecruitAI Automated Msg", visit.phone)
    .then((m) => res.status(201).json(visit))
    .catch((err) => res.status(400).json({message: err.message}))

});

router.put('/choose/:id/:choice', async (req, res) => {
  const { id, choice } = req.params
  let alert = null;

  let visit = await Visits.findById(req.params.id)
  visit = await Visits.update({ visit_status: "chosen", chosen_time: new Date(visit.time_options[choice]) }, id)
  if (visit) {
    const athlete = await Athletes.findById(visit.visit_athlete_id)
    alert = await Alerts.addAlert(visit.visit_athlete_id, athlete.recruiting_personnel_id, "visit-choice")
  }
  res.json({ visit, alert, message: "Confirmed." })
})

router.put('/confirm/:id', authenticate.team_restricted, async (req, res) => {
  const { id, choice } = req.params
  let alert = null;

  let visit = await Visits.findById(req.params.id)
  visit = await Visits.update({ visit_status: "confirmed" }, req.params.id)
  if (visit) {

    const athlete = await Athletes.findById(id)

    let visitDate = new Date(visit.chosen_time)
    visitDate.setDate(visitDate.getDate() - 2)
    alert = await Alerts.addAlert(id, athlete.recruiting_personnel_id, "visit-upcoming", visitDate)

  }

  res.json({ visit, alert, message: "Confirmed." })
})

router.put('/completed/:id', authenticate.team_restricted, async (req, res) => {
  let visit = await Visits.findById(req.params.id)
  visit = await Visits.update({ visit_status: "completed" }, req.params.id)
  res.json({ visit, message: "Confirmed." })
})

router.put('/missed/:id', authenticate.team_restricted, async (req, res) => {
  let visit = await Visits.findById(req.params.id)
  visit = await Visits.update({ visit_status: "missed" }, req.params.id)
  res.json({ visit, message: "Confirmed." })
})

router.put('/:id', authenticate.team_restricted, async (req, res) => {
  const { id } = req.params;
  const changes = req.body;



  Visits.update(changes, id)
    .then(updatedVisit => {
      res.json(updatedVisit);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to update visit' });
    });

});


router.delete('/:id', authenticate.team_restricted, async (req, res) => {
  const { id } = req.params;

  const visit = await Visits.findById(id)

  Visits.remove(id)
    .then(deleted => {
      res.send("Success.")
    })
    .catch(err => { res.status(500).json({ message: 'Failed to delete visit' }) });

});


module.exports = router;
