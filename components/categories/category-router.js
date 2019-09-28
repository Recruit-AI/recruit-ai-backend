const express = require('express');
const paginate = require('jw-paginate');

const Categories = require('./category-model.js');

const {user_restricted, mod_restricted, admin_restricted} = require('../middleware.js')

const router = express.Router();


router.get('/', (req, res) => {
  const sort = req.query.sort || "category_name"
  const sortdir = req.query.sortdir || "ASC"
  const searchTerm = req.query.search || ""

  Categories.find(sort, sortdir, searchTerm)
  .then(categories => {
    const items = categories

    // get page from query params or default to first page
    const page = parseInt(req.query.page) || 1;

    // get pager object for specified page
    const pageSize = 10;
    const pager = paginate(items.length, page, pageSize);

    // get page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // return pager object and current page of items
    return res.json({ pager, pageOfItems });
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get categories' });
  });
});

router.get('/nameList', (req, res) => {
  Categories.listOfNames()
  .then(items => {
    res.json(items)
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get items' });
  });
})


router.get('/:id', (req, res) => {
  const { id } = req.params;

  Categories.findById(id)
  .then(category => {
    if (category) {
      Categories.getImages(id).then(images => {
          Categories.getThumbnail(id).then(thumbnail => {
              Categories.findKindsByCategoryId(id).then(kinds => {
                  Categories.findPrereqsByCategoryId(id).then(prereqs => {
                      res.json({...category, thumbnail, images, kinds, prereqs})
                  }).catch(err => {res.status(500).json({ message: 'Failed to get prereqs.' })});
              }).catch(err => {res.status(500).json({ message: 'Failed to get kinds.' })});
          }).catch(err => {res.status(500).json({ message: 'Failed to get thumbnail.' })});
      }).catch(err => {res.status(500).json({ message: 'Failed to get images.' })});
    } else {
      res.status(404).json({ message: 'Could not find category with given id.' })
    }
  })
  .catch(err => {res.status(500).json({ message: 'Failed to get categories' });});
});


router.post('/', mod_restricted, (req, res) => {
  const categoryData = req.body;

  Categories.add(categoryData)
  .then(category => {
    res.status(201).json(category);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new category' });
  });
});

router.post('/prereqs', mod_restricted, (req, res) => {
  const data = req.body;

  Categories.addPrereq(data)
  .then(category => {
    res.status(201).json(category);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new connection' });
  });
})

router.post('/kinds', mod_restricted, (req, res) => {
  const data = req.body;

  Categories.addKindsConnection(data)
  .then(category => {
    res.status(201).json(category);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new connection' });
  });
})


router.put('/:id', mod_restricted, (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Categories.findById(id)
  .then(category => {
    if (category) {
      Categories.update(changes, id)
      .then(updatedCategory => {
        res.json(updatedCategory);
      });
    } else {
      res.status(404).json({ message: 'Could not find category with given id' });
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update category' });
  });
});

router.put('/kinds/:id', mod_restricted, (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Categories.editKindsConnection(changes, id)
  .then(category => {
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Could not find category with given id' });
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update category' });
  });
});

router.put('/prereqs/:id', mod_restricted, (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Categories.editPrereq(changes, id)
  .then(category => {
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Could not find category with given id' });
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update category' });
  });
});



router.delete('/:id', mod_restricted, (req, res) => {
  const { id } = req.params;
      Categories.remove(id)
      .then(deleted => {
        res.send("Success.")
      })
      .catch(err => { res.status(500).json({ message: 'Failed to delete category' }) });
});

router.delete('/kinds/:ck_id', mod_restricted, (req, res) => {
  const { ck_id } = req.params;
      Categories.removeKindsConnection(ck_id)
      .then(deleted => {
        res.send("Success.")
      })
      .catch(err => { res.status(500).json({ message: 'Failed to delete category' }) });
});

router.delete('/prereqs/:prereq_id', mod_restricted, (req, res) => {
  const { prereq_id } = req.params;
      Categories.removePrereq(prereq_id)
      .then(deleted => {
        res.send("Success.")
      })
      .catch(err => { res.status(500).json({ message: 'Failed to delete category' }) });
});


module.exports = router;
