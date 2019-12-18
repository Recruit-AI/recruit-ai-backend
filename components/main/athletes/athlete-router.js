const express = require('express');
const router = express.Router();

const Athletes = require('./athlete-model.js');

const { log } = require('../../core/administration/userLogs/log-middleware.js')
const authenticate = require('../../core/accounts/restricted-middleware.js')

router.get('/', authenticate.team_restricted, (req, res) => {
  const user_id = req.decodedToken.user.user_id
  const team_id = req.decodedToken.verified_team_id

  const sort = req.query.sort || 'preferred_name'
  const order = req.query.order || 'asc'
  const filter = req.query.filter || 'team'

  Athletes.find(team_id, user_id, sort, order, filter)
    .then(athletes => {
      res.json(athletes)
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get athletes' });
    });
})

router.get('/:id', authenticate.team_restricted, async (req, res) => {
  const { id } = req.params;

  const athlete = await Athletes.findById(id)

  if (athlete && authenticate.check_team(req, athlete.team_id)) {
    res.json(athlete)
  } else {
    res.status(404).json({ message: 'Could not find athlete with given id.' })
  }

});

router.post('/', authenticate.team_restricted, async (req, res) => {
  const athleteData = req.body;

  Athletes.add(athleteData)
    .then(athlete => {
      res.status(201).json(athlete);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to create new athlete', err: athleteData });
    });

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
