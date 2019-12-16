const express = require('express');
const router = express.Router();

const Athletes = require('./athlete-model.js');

const { log } = require('../../core/administration/userLogs/log-middleware.js')
const authenticate = require('../../core/accounts/restricted-middleware.js')

router.get('/', (req, res) => {
  Athletes.find()
    .then(athletes => {
      res.json(athletes)
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get athletes' });
    });
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const athlete = await Athletes.findById(id)
  if (athlete) {
    res.json(athlete)
  } else {
    res.status(404).json({ message: 'Could not find athlete with given id.' })
  }

});

router.post('/', authenticate.user_restricted, async (req, res) => {
  const athleteData = req.body;

  
    Athletes.add(athleteData)
      .then(athlete => {
        log(req, {}, athlete)
        res.status(201).json(athlete);
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to create new athlete', err: athleteData });
      });
  
});


router.put('/:id', authenticate.user_restricted, async (req, res) => {
  const { id } = req.params;
  const changes = req.body;


  const athlete = await Athletes.findById(id)
  if (await Athletes.findByName(changes.page_title, id)) {
    res.status(400).json({ message: "A record with this name already exists." })
  } else {
    Athletes.update(changes, id)
      .then(updatedAthlete => {
        log(req, athlete)
        res.json(updatedAthlete);
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to update athlete' });
      });
  }
});


router.delete('/:id', authenticate.user_restricted, async (req, res) => {
  const { id } = req.params;

  const athlete = await Athletes.findById(id)

  Athletes.remove(id)
    .then(deleted => {
      log(req, athlete)
      res.send("Success.")
    })
    .catch(err => { res.status(500).json({ message: 'Failed to delete athlete' }) });

});


module.exports = router;
