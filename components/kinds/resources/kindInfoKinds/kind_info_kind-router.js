const express = require('express');

const KindInfoKinds = require('./kind_info_kind-model.js');

const router = express.Router();
const {user_restricted, mod_restricted, admin_restricted} = require('../../../users/restricted-middleware.js')
const {log} = require('../../../userLogs/log-middleware.js')

router.get('/', (req, res) => {
  KindInfoKinds.find()
  .then(kind_info_kinds => {
    res.json(kind_info_kinds);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get kind_info_kinds' });
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  KindInfoKinds.findById(id)
  .then(kind_info_kind => {
    if (kind_info_kind) {
      res.json(kind_info_kind)
    } else {
      res.status(404).json({ message: 'Could not find kind_info_kind with given id.' })
    }
  })
  .catch(err => {res.status(500).json({ message: 'Failed to get kind_info_kinds' });});
});


router.post('/', user_restricted, (req, res) => {
  const kind_info_kindData = req.body;

  KindInfoKinds.add(kind_info_kindData)
  .then(kind_info_kind => {
    log(req, {}, kind_info_kind)
    res.status(201).json(kind_info_kind);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new kind_info_kind' });
  });

});

router.put('/:id', user_restricted, async (req, res) => {
  const { id } = req.params;
  const kind_info_kindData = req.body;

  log(req, await KindInfoKinds.findById(id))
  KindInfoKinds.update(kind_info_kindData, id)
  .then(updatedKindInfoKind => {
    res.json(updatedKindInfoKind);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update kind_info_kind' });
  });

});

router.delete('/:id', user_restricted, mod_restricted, async (req, res) => {
  const { id } = req.params;
    log(req, await KindInfoKinds.findById(id) )
  KindInfoKinds.remove(id)
  .then(deleted => {
    res.send("Success.")
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to delete kind_info_kind' })
  });
});

module.exports = router;
