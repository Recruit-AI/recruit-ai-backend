const express = require('express');

const KindSymbolConnections = require('./kind_symbol_connection-model.js');

const router = express.Router();
const {user_restricted, mod_restricted, admin_restricted} = require('../../../users/restricted-middleware.js')
const {log} = require('../../../userLogs/log-middleware.js')

router.get('/', (req, res) => {
  KindSymbolConnections.find()
  .then(kind_symbol_connections => {
    res.json(kind_symbol_connections);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get kind_symbol_connections' });
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  KindSymbolConnections.findById(id)
  .then(kind_symbol_connection => {
    if (kind_symbol_connection) {
      res.json(kind_symbol_connection)
    } else {
      res.status(404).json({ message: 'Could not find kind_symbol_connection with given id.' })
    }
  })
  .catch(err => {res.status(500).json({ message: 'Failed to get kind_symbol_connections' });});
});


router.post('/', user_restricted, (req, res) => {
  const kind_symbol_connectionData = req.body;

  KindSymbolConnections.add(kind_symbol_connectionData)
  .then(kind_symbol_connection => {
    log(req, {}, kind_symbol_connection)
    res.status(201).json(kind_symbol_connection);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new kind_symbol_connection' });
  });

});

router.put('/:id', user_restricted, async (req, res) => {
  const { id } = req.params;
  const kind_symbol_connectionData = req.body;

  log(req, await KindSymbolConnections.findById(id))
  KindSymbolConnections.update(kind_symbol_connectionData, id)
  .then(updatedKindSymbolConnection => {
    res.json(updatedKindSymbolConnection);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update kind_symbol_connection' });
  });

});

router.delete('/:id', user_restricted, mod_restricted, async (req, res) => {
  const { id } = req.params;
    log(req, await KindSymbolConnections.findById(id) )
  KindSymbolConnections.remove(id)
  .then(deleted => {
    res.send("Success.")
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to delete kind_symbol_connection' })
  });
});

module.exports = router;
