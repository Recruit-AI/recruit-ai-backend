const express = require('express');

const Feedbacks = require('./feedback-model.js');
const paginate = require('jw-paginate')

const router = express.Router();
const authenticate = require('../../accounts/restricted-middleware.js')

router.get('/', authenticate.admin_restricted, (req, res) => {
  const filter = req.query.filter || "unlogged"
  const kind = req.query.kind || ""

  Feedbacks.find(filter, kind)
    .then(items => {
      // get page from query params or default to first page
      const page = parseInt(req.query.page) || 1;

      // get pager object for specified page
      const pageSize = 25;
      const pager = paginate(items.length, page, pageSize);

      // get page of items from items array
      const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

      // return pager object and current page of items
      return res.json({pager, pageOfItems});
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get items' });
    });
});

router.get('/:id', authenticate.admin_restricted, (req, res) => {
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

router.put('/confirm/:id', authenticate.admin_restricted, (req, res) => {
  const { id } = req.params;

  Feedbacks.update({logged: true}, id)
  .then(updatedFeedback => {
    res.json(updatedFeedback);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update feedback' });
  });

});

router.delete('/:id', authenticate.admin_restricted, (req, res) => {
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
