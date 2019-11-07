const express = require('express');

const Feedbacks = require('./feedback-model.js');

const router = express.Router();
const {user_restricted, mod_restricted, admin_restricted} = require('../users/restricted-middleware.js')

router.get('/all', user_restricted, admin_restricted, (req, res) => {
  Feedbacks.find()
  .then(feedbacks => {
    res.json(feedbacks);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get feedbacks' });
  });
});

router.get('/unlogged', user_restricted, admin_restricted, (req, res) => {
  Feedbacks.findUnlogged()
  .then(feedbacks => {
    res.json(feedbacks);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get feedbacks' });
  });
});

router.get('/:id', user_restricted, admin_restricted, (req, res) => {
  const { id } = req.params;

  Feedbacks.findById(id)
  .then(feedback => {
    if (feedback) {
      res.json(feedback)
    } else {
      res.status(404).json({ message: 'Could not find feedback with given id.' })
    }
  })
  .catch(err => {res.status(500).json({ message: 'Failed to get feedbacks' });});
});


router.post('/', (req, res) => {
  const feedbackData = req.body;

  Feedbacks.add(feedbackData)
  .then(feedback => {
    res.status(201).json(feedback);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new feedback' });
  });

});

router.put('/confirm/:id', user_restricted, admin_restricted, (req, res) => {
  const { id } = req.params;

  Feedbacks.update({logged: true}, id)
  .then(updatedFeedback => {
    res.json(updatedFeedback);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update feedback' });
  });

});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Feedbacks.remove(id)
  .then(deleted => {
    res.send("Success.")
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to delete feedback' })
  });
});

module.exports = router;
