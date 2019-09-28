const express = require('express');
const paginate = require('jw-paginate')
const Kinds = require('./kind-model.js');

const {user_restricted, mod_restricted, admin_restricted} = require('../middleware.js')

const router = express.Router();



router.get('/', (req, res) => {
  const sort = req.query.sort || "kind_name"
  const sortdir = req.query.sortdir || "ASC"
  const searchTerm = req.query.search || ""

  Kinds.find(sort, sortdir, searchTerm)
  .then(kinds => {
    const items = kinds
    // get page from query params or default to first page
    const page = parseInt(req.query.page) || 1;

    // get pager object for specified page
    const pageSize = 10;
    const pager = paginate(items.length, page, pageSize);

    // get page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // return pager object and current page of items
    return res.json({ pager, pageOfItems: pageOfItems.map(
      kind => ({
        ...kind,
        specific_order: kind.specific_order === 1 ? true : false
      })
    )});
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get kinds' });
  });
});


router.get('/:id', (req, res) => {
  const { id } = req.params;

  Kinds.findById(id)
  .then(kind => {
    if (kind) {
      Kinds.getImages(id).then(images => {
          Kinds.getThumbnail(id).then(thumbnail => {
            Kinds.findPantheonsByKindId(id).then(pantheons => {
              console.log("P", pantheons)
              Kinds.getSymbols(id).then(symbols => {
                console.log("S", symbols)
                res.json(
                  {
                    ...kind,
                    specific_order: kind.specific_order === 1 ? true : false,
                    default_extra_info: JSON.parse(kind.default_extra_info),
                    thumbnail,
                    images,
                    pantheons,
                    symbols: symbols.map((symbol) => {
                      symbol.extra_info = JSON.parse(symbol.extra_info)
                      return symbol
                    })
                  }
                )
              }).catch(err => {res.status(500).json({ message: 'Failed to get pantheons.' })});
            }).catch(err => {res.status(500).json({ message: 'Failed to get pantheons.' })});
          }).catch(err => {res.status(500).json({ message: 'Failed to get images.' })});
      }).catch(err => {res.status(500).json({ message: 'Failed to get images.' })});
    } else {
      res.status(404).json({ message: 'Could not find kind with given id.' })
    }
  })
  .catch(err => {res.status(500).json({ message: 'Failed to get kinds' });});
});


router.post('/', mod_restricted, (req, res) => {
  const kindData = req.body;

  Kinds.add(kindData)
  .then(kind => {
    res.status(201).json(kind);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new kind' });
  });
});

router.post('/pantheons', mod_restricted, (req, res) => {
  const data = req.body;

  Kinds.addPantheonConnection(data)
  .then(kind => {
    res.status(201).json(kind);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new connection' });
  });
})

router.put('/pantheons/:id', mod_restricted, (req, res) => {
  const { id } = req.params;
  const data = req.body;

  Kinds.editPantheonConnection(data, id)
  .then(kind => {
    res.status(201).json(kind);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new connection' });
  });
})


router.put('/:id', mod_restricted, (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Kinds.findById(id)
  .then(kind => {
    if (kind) {
      Kinds.update(changes, id)
      .then(updatedKind => {
        res.json(updatedKind);
      });
    } else {
      res.status(404).json({ message: 'Could not find kind with given id' });
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update kind' });
  });
});


router.delete('/:id', mod_restricted, (req, res) => {
  const { id } = req.params;
      Kinds.remove(id)
      .then(deleted => {
        res.send("Success.")
      })
      .catch(err => { res.status(500).json({ message: 'Failed to delete kind' }) });
});

router.delete('/pantheons/:kp_id', mod_restricted, (req, res) => {
  const { kp_id } = req.params;
      Kinds.removeKindPantheonConnection(kp_id)
      .then(deleted => {
        res.send("Success.")
      })
      .catch(err => { res.status(500).json({ message: 'Failed to delete kind' }) });
});


module.exports = router;
