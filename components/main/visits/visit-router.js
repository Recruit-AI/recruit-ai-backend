const express = require('express');
const router = express.Router();

const Visits = require('./visit-model.js');

const { log } = require('../../core/administration/userLogs/log-middleware.js')
const authenticate = require('../../core/accounts/restricted-middleware.js')

//Change status
//Set time options
//Confirm time- send email

router.get('/', authenticate.user_restricted, (req, res) => {
  const user = req.decodedToken.user

  Visits.find(user.user_id)
    .then(visits => {
      res.json(visits)
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get visits' });
    });
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const visit = await Visits.findById(id)
  if (visit) {
    res.json(visit)
  } else {
    res.status(404).json({ message: 'Could not find visit with given id.' })
  }

});

router.post('/', authenticate.user_restricted, async (req, res) => {
  const visitData = req.body;
  
    Visits.add(visitData)
      .then(visit => {
        res.status(201).json(visit);
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to create new visit', err: visitData });
      });
  
});

router.put('/confirm/:id/:choice', async(req, res) => {
  let visit = await Visits.findById(req.params.id)
  visit = await Visits.update({chosen_time: new Date(visit.time_options[req.params.choice])}, req.params.id)
  res.json({visit, message: "Confirmed."})

})

router.put('/notes/:id', authenticate.user_restricted, async (req, res) => {
  const id = req.params.id
  const user = req.decodedToken.user
  let notes = req.body.notes

  date = new Date(Date.now()),
  v = [
    date.getFullYear(),
    date.getMonth()+1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
  const dateString = `${v[1]}/${v[2]} ${v[0]}, ${v[3]}:${v[4]}`
  let visit = await Visits.findById(id)

  notes = visit.notes + notes + `\n${user.userInfo.user_display_name}- ${dateString}\n\n\n`

  visit = await Visits.update({notes}, id)

  res.json(visit)

})

router.put('/:id', authenticate.user_restricted, async (req, res) => {
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


router.delete('/:id', authenticate.user_restricted, async (req, res) => {
  const { id } = req.params;

  const visit = await Visits.findById(id)

  Visits.remove(id)
    .then(deleted => {
      res.send("Success.")
    })
    .catch(err => { res.status(500).json({ message: 'Failed to delete visit' }) });

});


module.exports = router;
