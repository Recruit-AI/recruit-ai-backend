const express = require('express');
const paginate = require('jw-paginate')

const Resources = require('./resource-model.js');

const router = express.Router();
const {user_restricted, mod_restricted, admin_restricted} = require('../users/restricted-middleware.js')

router.get('/', (req, res) => {
  const tag = req.query.tag
  const type = req.query.type
  const sortdir = req.query.sortdir || "ASC"
  const searchTerm = req.query.search || ""

  Resources.find(tag, sortdir, searchTerm, type)
  .then(resources => {
    const items = resources

    // get page from query params or default to first page
    const page = parseInt(req.query.page) || 1;

    // get pager object for specified page
    const pageSize = 10;
    const pager = paginate(items.length, page, pageSize);

    // get page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // return pager object and current page of items
    return res.json({ pager, pageOfItems})
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get resources' });
  });
});

router.post('/', user_restricted, (req, res) => {
  const resourceData = req.body;

  Resources.add(resourceData)
  .then(resource => {
    res.status(201).json(resource);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new resource' });
  });

});

router.put('/:id', user_restricted, (req, res) => {
  const { id } = req.params;

  Resources.update({logged: true}, id)
  .then(updatedResource => {
    res.json(updatedResource);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update resource' });
  });

});

router.delete('/:id', user_restricted, (req, res) => {
  const { id } = req.params;
  Resources.remove(id)
  .then(deleted => {
    res.send("Success.")
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to delete resource' })
  });
});

module.exports = router;
