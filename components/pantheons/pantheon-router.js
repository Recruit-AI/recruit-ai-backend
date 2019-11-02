const express = require('express');
const paginate = require('jw-paginate')

const Pantheons = require('./pantheon-model.js');
const Images = require('../images/image-model.js');
const Sources = require('../sources/source-model.js');


const {user_restricted, mod_restricted, admin_restricted} = require('../users/restricted-middleware.js')
const {log} = require('../logs/log-middleware.js')
const router = express.Router();

const PantheonHistoryRouter = require('./resources/pantheonHistories/pantheon_history-router.js');
router.use('/histories', PantheonHistoryRouter);

router.get('/', (req, res) => {
  const sort = req.query.sort || "pantheon_name"
  const sortdir = req.query.sortdir || "ASC"
  const searchTerm = req.query.search || ""

  Pantheons.find(sort, sortdir, searchTerm)
  .then(pantheons => {
    const items = pantheons

    // get page from query params or default to first page
    const page = parseInt(req.query.page) || 1;

    // get pager object for specified page
    const pageSize = 10;
    const pager = paginate(items.length, page, pageSize);

    // get page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // return pager object and current page of items
    return res.json({ pager, pageOfItems: pageOfItems.map(
      pantheon => ({
        ...pantheon,
        thumbnail: {
          image_url: pantheon.image_url,
          thumbnail: pantheon.thumbnail,
          image_title: pantheon.image_title,
          image_description: pantheon.image_description,
          image_id: pantheon.image_id
        }
      })
    )});

  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get pantheons' });
  });
});

router.get('/nameList', (req, res) => {
  Pantheons.listOfNames()
  .then(items => {
    res.json(items)
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get items' });
  });
})



router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const pantheon = await Pantheons.findById(id)
  if (pantheon) {
    const images = await Images.getImages(id)
    const thumbnail = await Images.getThumbnail(id)
    const sources = await Sources.getSources('Pantheon', id)
    const created_kinds = await Pantheons.getCreatedKinds(id)
    const uses_kinds = await Pantheons.getUsesKinds(id)
    const history = await PantheonHistories.getHistories(id)
    const influenced = await PantheonHistories.getInfluneced(id)
    res.json({...pantheon, thumbnail, images, sources,  history, influenced, created_kinds, uses_kinds})
  } else {
    res.status(404).json({ message: 'Could not find pantheon with given id.' })
  }

});


router.post('/', user_restricted, (req, res) => {
  const pantheonData = req.body;

  Pantheons.add(pantheonData)
  .then(pantheon => {
    log(req, {}, pantheon)
    res.status(201).json(pantheon);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new pantheon', err: pantheonData });
  });
});


router.put('/:id', user_restricted, (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Pantheons.findById(id)
  .then(pantheon => {
    if (pantheon) {
      log(req, pantheon)
      Pantheons.update(changes, id)
      .then(updatedPantheon => {
        res.json(updatedPantheon);
      });
    } else {
      res.status(404).json({ message: 'Could not find pantheon with given id' });
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update pantheon' });
  });
});


//First, remove all histories, then delete the pantheon record itself.
router.delete('/:id', user_restricted,  async (req, res) => {
  const { id } = req.params;

  log(req, await Patheons.findById(id) )
  Pantheons.removeHistoriesById(id)
  .then(deleted => {
      //Be sure to log pantheon history ids as they are getting
      Pantheons.remove(id)
      .then(deleted => {
        res.send("Success.")
      })
      .catch(err => { res.status(500).json({ message: 'Failed to delete pantheon' }) });
  })
  .catch(err => { res.status(500).json({ message: 'Failed to delete pantheon histories.' }) });
});


module.exports = router;
