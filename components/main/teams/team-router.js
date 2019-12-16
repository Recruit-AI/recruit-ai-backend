const express = require('express');
const router = express.Router();

const Teams = require('./team-model.js');


const { log } = require('../../core/administration/userLogs/log-middleware.js')
const authenticate = require('../../core/accounts/restricted-middleware.js')

router.get('/', (req, res) => {
  Teams.find()
    .then(teams => {
      res.json(teams)
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get teams' });
    });
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const team = await Teams.findById(id)
  if (team) {
    res.json(team)
  } else {
    res.status(404).json({ message: 'Could not find team with given id.' })
  }

});

router.post('/', authenticate.user_restricted, async (req, res) => {
  const teamData = req.body;

  if (await Teams.findByName(teamData.team_name)) {
    res.status(400).json({ message: "A record with this name already exists." })
  } else {
    Teams.add(teamData)
      .then(team => {
        res.status(201).json(team);
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to create new team', err: teamData });
      });
  }
});


router.put('/:id', authenticate.user_restricted, async (req, res) => {
  const { id } = req.params;
  const changes = req.body;


  const team = await Teams.findById(id)
  if (await Teams.findByName(changes.team_name, id)) {
    res.status(400).json({ message: "A record with this name already exists." })
  } else {
    Teams.update(changes, id)
      .then(updatedTeam => {
        res.json(updatedTeam);
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to update team' });
      });
  }
});


router.delete('/:id', authenticate.user_restricted, async (req, res) => {
  const { id } = req.params;

  const team = await Teams.findById(id)

  Teams.remove(id)
    .then(deleted => {
      res.send("Success.")
    })
    .catch(err => { res.status(500).json({ message: 'Failed to delete team' }) });

});


module.exports = router;
