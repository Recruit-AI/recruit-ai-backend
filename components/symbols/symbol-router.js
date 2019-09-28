const express = require('express');
const paginate = require('jw-paginate')
const Symbols = require('./symbol-model.js');

const {user_restricted, mod_restricted, admin_restricted} = require('../middleware.js')

const router = express.Router();




router.get('/', (req, res) => {
  const sort = req.query.sort || "symbol_name"
  const sortdir = req.query.sortdir || "ASC"
  const searchTerm = req.query.search || ""

  Symbols.find(sort, sortdir, searchTerm)
  .then(symbols => {
    const items = symbols

    // get page from query params or default to first page
    const page = parseInt(req.query.page) || 1;

    // get pager object for specified page
    const pageSize = 10;
    const pager = paginate(items.length, page, pageSize);

    // get page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // return pager object and current page of items
    return res.json({ pager, pageOfItems: pageOfItems.map(item => ({
      ...item,
      //extra_info: JSON.parse(item.extra_info),
      thumbnail: {
        image_url: item.image_url,
        thumbnail: item.thumbnail,
        image_title: item.image_title,
        image_description: item.image_description,
        image_id: item.image_id
      }
    })
    )});


  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get symbols' });
  });
});


router.get('/:id', (req, res) => {
  const { id } = req.params;

  Symbols.findById(id)
  .then(symbol => {
    if (symbol) {
      Symbols.getImages(id).then(images => {
          Symbols.getThumbnail(id).then(thumbnail => {
              Symbols.findPantheonsBySymbolId(id).then(pantheons => {
                  Symbols.findConnectionsBySymbolId(id).then(connections => {
                      Symbols.findKind(symbol.symbol_kind_id).then(kind => {
                          res.json(
                            {
                              ...symbol,
                              //extra_info: JSON.parse(symbol.extra_info),
                              thumbnail,
                              images,
                              pantheons,
                              connections,
                              kind: {...kind,
                                //default_extra_info: JSON.parse(kind.default_extra_info)
                              }
                            }
                          )
                      }).catch(err => {res.status(500).json({ message: 'Failed to get kind.' })});
                  }).catch(err => {res.status(500).json({ message: 'Failed to get prereqs.' })});
              }).catch(err => {res.status(500).json({ message: 'Failed to get kinds.' })});
          }).catch(err => {res.status(500).json({ message: 'Failed to get thumbnail.' })});
      }).catch(err => {res.status(500).json({ message: 'Failed to get images.' })});
    } else {
      res.status(404).json({ message: 'Could not find symbol with given id.' })
    }
  })
  .catch(err => {res.status(500).json({ message: 'Failed to get symbols' });});
});

router.get('/nameList', (req, res) => {
  Symbols.listOfNames()
  .then(items => {
    res.json(items)
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get items' });
  });
}



router.post('/', user_restricted, (req, res) => {
  const symbolData = req.body;

  Symbols.add(symbolData)
  .then(symbol => {
    res.status(201).json(symbol);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new symbol' });
  });
});

router.post('/connections', user_restricted, (req, res) => {
  const data = req.body;

  Symbols.addConnection(data)
  .then(symbol => {
    res.status(201).json(symbol);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new connection' });
  });
})

router.post('/pantheons', mod_restricted, (req, res) => {
  const data = req.body;

  Symbols.addPantheonsConnection(data)
  .then(symbol => {
    res.status(201).json(symbol);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new connection' });
  });
})


router.put('/:id', user_restricted, (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Symbols.findById(id)
  .then(symbol => {
    if (symbol) {
      Symbols.update(changes, id)
      .then(updatedSymbol => {
        res.json(updatedSymbol);
      });
    } else {
      res.status(404).json({ message: 'Could not find symbol with given id' });
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update symbol' });
  });
});

router.put('/connections/:id', user_restricted, (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Symbols.editConnection(changes, id)
  .then(symbol => {
    if (symbol) {
      res.json(symbol)
    } else {
      res.status(404).json({ message: 'Could not find symbol with given id' });
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update symbol' });
  });
});

router.put('/pantheons/:id', user_restricted, (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Symbols.editPantheonsConnection(changes, id)
  .then(symbol => {
    if (symbol) {
      res.json(symbol);
    } else {
      res.status(404).json({ message: 'Could not find symbol with given id' });
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update symbol' });
  });
});

router.delete('/:id', mod_restricted, (req, res) => {
  const { id } = req.params;
      Symbols.remove(id)
      .then(deleted => {
        res.send("Success.")
      })
      .catch(err => { res.status(500).json({ message: 'Failed to delete symbol' }) });
});

router.delete('/connections/:connection_id', mod_restricted, (req, res) => {
  const { connection_id } = req.params;
      Symbols.removePantheonsConnection(connection_id)
      .then(deleted => {
        res.send("Success.")
      })
      .catch(err => { res.status(500).json({ message: 'Failed to delete symbol' }) });
});

router.delete('/pantheons/:symbol_pantheon_id', mod_restricted, (req, res) => {
  const { symbol_pantheon_id } = req.params;
      Symbols.removeConnection(symbol_pantheon_id)
      .then(deleted => {
        res.send("Success.")
      })
      .catch(err => { res.status(500).json({ message: 'Failed to delete symbol' }) });
});


module.exports = router;
