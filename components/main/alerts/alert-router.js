const express = require('express');
const router = express.Router();

const Alerts = require('./alert-model.js');

const { log } = require('../../core/administration/userLogs/log-middleware.js')
const authenticate = require('../../core/accounts/restricted-middleware.js')

router.get('/', authenticate.user_restricted, (req, res) => {
  const user = req.decodedToken.user

  Alerts.find(user.user_id)
    .then(alerts => {
      res.json(alerts)
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get alerts' });
    });
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const alert = await Alerts.findById(id)
  if (alert) {
    res.json(alert)
  } else {
    res.status(404).json({ message: 'Could not find alert with given id.' })
  }

});

router.post('/', authenticate.user_restricted, async (req, res) => {
  const alertData = req.body;
  
    Alerts.add(alertData)
      .then(alert => {
        res.status(201).json(alert);
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to create new alert', err: alertData });
      });
  
});

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
  let alert = await Alerts.findById(id)

  notes = alert.notes + notes + `\n${user.userInfo.user_display_name}- ${dateString}\n\n\n`

  alert = await Alerts.update({notes}, id)

  res.json(alert)

})

router.put('/:id', authenticate.user_restricted, async (req, res) => {
  const { id } = req.params;
  const changes = req.body;


  
    Alerts.update(changes, id)
      .then(updatedAlert => {
        res.json(updatedAlert);
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to update alert' });
      });
  
});


router.delete('/:id', authenticate.user_restricted, async (req, res) => {
  const { id } = req.params;

  const alert = await Alerts.findById(id)

  Alerts.remove(id)
    .then(deleted => {
      res.send("Success.")
    })
    .catch(err => { res.status(500).json({ message: 'Failed to delete alert' }) });

});


module.exports = router;
