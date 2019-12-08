const express = require('express');

const SymbolResources = require('./symbol_resource-model.js');

const router = express.Router();

const { user_restricted, mod_restricted, admin_restricted } = require('../../../users/restricted-middleware.js')
const { log } = require('../../../userLogs/log-middleware.js')

router.get('/', (req, res) => {
  SymbolResources.find()
    .then(symbol_resources => {
      res.json(symbol_resources);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get symbol_resources' });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  SymbolResources.findById(id)
    .then(symbol_resource => {
      if (symbol_resource) {
        res.json(symbol_resource)
      } else {
        res.status(404).json({ message: 'Could not find symbol_resource with given id.' })
      }
    })
    .catch(err => { res.status(500).json({ message: 'Failed to get symbol_resources' }); });
});



router.post('/', user_restricted, (req, res) => {
  const data = req.body;
  let duplicateConnection = data.duplicateConnection
  delete data.duplicateConnection

  SymbolResources.add(data)
    .then(symbol => {
      res.status(201).json(symbol)
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to create new connection' });
    });
})

router.put('/:id', user_restricted, async (req, res) => {
  const { id } = req.params;
  const symbol_resourceData = req.body;

  log(req, await SymbolResources.findById(id))
  SymbolResources.update(symbol_resourceData, id)
    .then(updatedCategoryToPantheon => {
      res.json(updatedCategoryToPantheon);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to update symbol_resource' });
    });

});

router.delete('/:id', user_restricted, mod_restricted, async (req, res) => {
  const { id } = req.params;
  log(req, await SymbolResources.findById(id))
  SymbolResources.remove(id)
    .then(deleted => {
      res.send("Success.")
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to delete symbol_resource' })
    });
});

module.exports = router;
