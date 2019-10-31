const express = require('express');

const CategoryToKinds = require('./category_to_kind-model.js');

const router = express.Router();

router.get('/', (req, res) => {
  CategoryToKinds.find()
  .then(category_to_kinds => {
    res.json(category_to_kinds);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get category_to_kinds' });
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  CategoryToKinds.findById(id)
  .then(category_to_kind => {
    if (category_to_kind) {
      res.json(category_to_kind)
    } else {
      res.status(404).json({ message: 'Could not find category_to_kind with given id.' })
    }
  })
  .catch(err => {res.status(500).json({ message: 'Failed to get category_to_kinds' });});
});


router.post('/', (req, res) => {
  const category_to_kindData = req.body;

  CategoryToKinds.add(category_to_kindData)
  .then(category_to_kind => {
    res.status(201).json(category_to_kind);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new category_to_kind' });
  });

});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const category_to_kindData = req.body;

  CategoryToKinds.update(category_to_kindData, id)
  .then(updatedCategoryToKind => {
    res.json(updatedCategoryToKind);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update category_to_kind' });
  });

});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  CategoryToKinds.remove(id)
  .then(deleted => {
    res.send("Success.")
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to delete category_to_kind' })
  });
});

module.exports = router;
