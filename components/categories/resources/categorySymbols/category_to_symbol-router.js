const express = require('express');

const CategoryToSymbols = require('./category_to_symbol-model.js');

const router = express.Router();
const {user_restricted, mod_restricted, admin_restricted} = require('../../../users/restricted-middleware.js')
const {log} = require('../../../userLogs/log-middleware.js')

router.get('/', (req, res) => {
  CategoryToSymbols.find()
  .then(category_to_symbols => {
    res.json(category_to_symbols);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get category_to_symbols' });
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  CategoryToSymbols.findById(id)
  .then(category_to_symbol => {
    if (category_to_symbol) {
      res.json(category_to_symbol)
    } else {
      res.status(404).json({ message: 'Could not find category_to_symbol with given id.' })
    }
  })
  .catch(err => {res.status(500).json({ message: 'Failed to get category_to_symbols' });});
});


router.post('/', user_restricted, (req, res) => {
  const category_to_symbolData = req.body;

  CategoryToSymbols.add(category_to_symbolData)
  .then(category_to_symbol => {
    log(req, {}, category_to_symbol)
    res.status(201).json(category_to_symbol);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new category_to_symbol' });
  });

});

router.put('/:id', user_restricted, async (req, res) => {
  const { id } = req.params;
  const category_to_symbolData = req.body;

  log(req, await CategoryToSymbols.findById(id))
  CategoryToSymbols.update(category_to_symbolData, id)
  .then(updatedCategoryToSymbol => {
    res.json(updatedCategoryToSymbol);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update category_to_symbol' });
  });

});

router.delete('/:id', user_restricted, mod_restricted, async (req, res) => {
  const { id } = req.params;
    log(req, await CategoryToSymbols.findById(id) )
  CategoryToSymbols.remove(id)
  .then(deleted => {
    res.send("Success.")
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to delete category_to_symbol' })
  });
});

module.exports = router;
