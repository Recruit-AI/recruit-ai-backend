const express = require('express');
const paginate = require('jw-paginate');
const router = express.Router();

const Kinds = require('./kind-model.js');
const KindPantheons = require('./resources/kindPantheons/kind_to_pantheon-model.js');
const Images = require('../images/image-model.js');
const Sources = require('../sources/source-model.js');

const KindPantheonRouter = require('./resources/kindPantheons/kind_to_pantheon-router.js');
router.use('/pantheons', KindPantheonRouter);

const {user_restricted, mod_restricted, admin_restricted} = require('../users/restricted-middleware.js')
const {log} = require('../logs/log-middleware.js')

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

router.get('/nameList', (req, res) => {
  Kinds.listOfNames()
  .then(kinds => {
    res.json(kinds)
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get kinds' });
  });
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const kind = await Kinds.findById(id)
  if (kind) {
    const thumbnail = await Images.getThumbnail('Kind', id)
    const images = await Images.getImages('Kind', id)
    const sources = await Sources.getSources('Kind', id)
    const symbols = await Kinds.getSymbols(id)
    const pantheons =  await KindPantheons.findByKind(id)
    res.json({...kind, thumbnail, images, sources, pantheons, symbols})
  } else {
    res.status(404).json({ message: 'Could not find kind with given id.' })
  }

});


router.post('/', user_restricted, (req, res) => {
  const kindData = req.body;

  Kinds.add(kindData)
  .then(kind => {
    log(req, {}, kind)
    res.status(201).json(kind);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new kind' });
  });
});

router.put('/:id', user_restricted, (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Kinds.findById(id)
  .then(kind => {
    if (kind) {
      log(req, kind)
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


router.delete('/:id', user_restricted, mod_restricted, async (req, res) => {
  const { id } = req.params;
  log(req, await Kinds.findById(id) )
      Kinds.remove(id)
      .then(deleted => {
        res.send("Success.")
      })
      .catch(err => { res.status(500).json({ message: 'Failed to delete kind' }) });
});

module.exports = router;
