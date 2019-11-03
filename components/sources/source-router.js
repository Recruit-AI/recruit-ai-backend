const express = require('express');

const Sources = require('./source-model.js');

const router = express.Router();

const {user_restricted, mod_restricted, admin_restricted} = require('../users/restricted-middleware.js')
const {log} = require('../logs/log-middleware.js')

router.get('/', (req, res) => {
  Sources.find()
  .then(sources => {
    res.json(sources);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get sources' });
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Sources.findById(id)
  .then(source => {
    if (source) {
      res.json(source)
    } else {
      res.status(404).json({ message: 'Could not find source with given id.' })
    }
  })
  .catch(err => {res.status(500).json({ message: 'Failed to get sources' });});
});


router.post('/', user_restricted, (req, res) => {
  const sourceData = req.body;

  Sources.add(sourceData)
  .then(source => {
    log(req, {}, source)
    res.status(201).json(source);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new source' });
  });

});

router.put('/:id', user_restricted, async (req, res) => {
  const { id } = req.params;
  const sourceData = req.body;

  log(req, await Sources.findById(id) )
  Sources.update(sourceData, id)
  .then(updatedSource => {
    res.json(updatedSource);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update source' });
  });

});

router.delete('/:id', user_restricted, mod_restricted, async (req, res) => {
  const { id } = req.params;
    log(req, await Sources.findById(id) )
  Sources.remove(id)
  .then(deleted => {
    res.send("Success.")
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to delete source' })
  });
});

module.exports = router;
