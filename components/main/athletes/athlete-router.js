const express = require('express');
const router = express.Router();

const paginate = require('jw-paginate')
const Athletes = require('./athlete-model.js');

const { log } = require('../../core/administration/userLogs/log-middleware.js')
const authenticate = require('../../core/accounts/restricted-middleware.js')


var twilio = require('twilio');
const bodyParser = require('body-parser');
const MessagingResponse = twilio.twiml.MessagingResponse;
router.use(bodyParser.urlencoded({ extended: false }));
const { sendMessage } = require('../messages/message-helper')

router.get('/', authenticate.team_restricted, (req, res) => {
  const user_id = req.decodedToken.user.user_id
  const team_id = req.decodedToken.verified_team_id

  const sort = req.query.sort || 'preferred_name'
  const order = req.query.order || 'asc'
  const filter = req.query.filter || 'team'

  Athletes.find(team_id, user_id, sort, order, filter)
    .then(athletes => {
      // get page from query params or default to first page
      const page = parseInt(req.query.page) || 1;
  
      // get pager object for specified page
      const pageSize = 2;
      const pager = paginate(athletes.length, page, pageSize);
  
      // get page of site_blogs from site_blogs array
      const pageOfItems = athletes.slice(pager.startIndex, pager.endIndex + 1);
  
      // return pager object and current page of site_blogs
      return res.json({pager, pageOfItems});
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get athletes' });
    });
})

router.get('/:id', authenticate.team_restricted, async (req, res) => {
  const { id } = req.params;

  const athlete = await Athletes.findById(id)
  const visits = await Athletes.findVisitsByAthleteId(id)
  athlete.visits = visits

  if (athlete && authenticate.check_team(req, athlete.team_id)) {
    res.json(athlete)
  } else {
    res.status(404).json({ message: 'Could not find athlete with given id.' })
  }
});

router.get('/public/:id', async (req, res) => {
  const { id } = req.params;

  const athlete = await Athletes.findById(id)
  if (athlete) {
    res.json(athlete)
  } else {
    res.status(404).json({ message: 'Could not find athlete with given id.' })
  }
});

router.put('/public/:id',  async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Athletes.update(changes, id)
    .then(updatedAthlete => {
      res.json(updatedAthlete);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to update athlete' });
    });

});

router.post('/', authenticate.team_restricted, async (req, res) => {
  const athleteData = req.body;

  const athlete = await Athletes.add(athleteData)
      
  let text = `${athlete.user_display_name} has created you an account with RecruitAI.
  Please click this link to set up your information: https://recruit-ai.netlify.com/athletes/${athlete.athlete_id}/public`

  sendMessage(text, "RecruitAI Automated Msg", athlete.phone)
    .then((m) => res.status(201).json(athlete))
    .catch((err) => console.log(err))
  

});

router.put('/notes/:id', authenticate.team_restricted, async (req, res) => {
  const id = req.params.id
  const user = req.decodedToken.user
  let notes = req.body.notes

  date = new Date(Date.now()),
    v = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ];
  const dateString = `${v[1]}/${v[2]} ${v[0]}, ${v[3]}:${v[4]}`
  let athlete = await Athletes.findById(id)


  notes = (athlete.notes ? athlete.notes : "") + notes + `\n${user.userInfo.user_display_name}- ${dateString}\n\n\n`

  athlete = await Athletes.update({ notes }, id)

  res.json(athlete)

})

router.put('/:id', authenticate.team_restricted, async (req, res) => {
  const { id } = req.params;
  const changes = req.body;



  Athletes.update(changes, id)
    .then(updatedAthlete => {
      res.json(updatedAthlete);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to update athlete' });
    });

});


router.delete('/:id', authenticate.team_restricted, async (req, res) => {
  const { id } = req.params;

  Athletes.remove(id)
    .then(deleted => {
      res.send("Success.")
    })
    .catch(err => { res.status(500).json({ message: 'Failed to delete athlete' }) });

});


module.exports = router;
