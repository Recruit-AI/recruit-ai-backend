const express = require('express');
const paginate = require('jw-paginate');
const router = express.Router();

const Categories = require('./category-model.js');
const CategoryPrereqs = require('./resources/categoryPrerequisites/category_prerequisite-model.js');
const CategoryPantheons = require('./resources/categoryPantheons/category_to_pantheon-model.js');
const CategoryKinds = require('./resources/categoryKinds/category_to_kind-model.js');
const CategorySymbols = require('./resources/categorySymbols/category_to_symbol-model.js');

const Images = require('../images/image-model.js');
const Sources = require('../sources/source-model.js');

const CategoryPrereqRouter = require('./resources/categoryPrerequisites/category_prerequisite-router.js');
const CategoryPantheonRouter = require('./resources/categoryPantheons/category_to_pantheon-router.js');
const CategoryKindRouter = require('./resources/categoryKinds/category_to_kind-router.js');
const CategorySymbolRouter = require('./resources/categorySymbols/category_to_symbol-router.js');

router.use('/prerequisites', CategoryPrereqRouter);
router.use('/pantheons', CategoryPantheonRouter);
router.use('/kinds', CategoryKindRouter);
router.use('/symbols', CategorySymbolRouter);

const {user_restricted, mod_restricted, admin_restricted} = require('../users/restricted-middleware.js')
const {log} = require('../userLogs/log-middleware.js')

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

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const category = await Categories.findById(id)
  if (category) {
    const images = await Images.getImages('Category', id)
    const thumbnail = await Images.getThumbnail('Category', id)
    const sources = await Sources.getSources('Category', id)
    const prerequisites = await CategoryPrereqs.findByCategory(id)
    const advanced = await CategoryPrereqs.findAdvancedByCategory(id)
    const kinds = await CategoryKinds.findByCategory(id)
    const symbols = await CategorySymbols.findByCategory(id)
    const pantheons = await CategoryPantheons.findByCategory(id)
    res.json({...category, thumbnail, images, sources, prerequisites, advanced, kinds, symbols, pantheons})
  } else {
    res.status(404).json({ message: 'Could not find category with given id.' })
  }
});

router.post('/', user_restricted, async (req, res) => {
  const categoryData = req.body;

  if(await Categories.findByName(categoryData.category_name)) {
    res.status(400).json({message: "A record with this name already exists."})
  } else {
    Categories.add(categoryData)
    .then(category => {
      log(req, {}, category)
      res.status(201).json(category);
    })
    .catch (err => {
      res.status(500).json({ message: 'Failed to create new category' });
    });
  }
});

router.put('/:id',user_restricted,  async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  if(await Categories.findByName(changes.category_name, id)) {
    res.status(400).json({message: "A record with this name already exists."})
  } else {
    Categories.findById(id)
    .then(category => {
      if (category) {
        Categories.update(changes, id)
        .then(updatedCategory => {
          log(req, category)
          res.json(updatedCategory);
        });
      } else {
        res.status(404).json({ message: 'Could not find category with given id' });
      }
    })
    .catch (err => {
      res.status(500).json({ message: 'Failed to update category' });
    });
  }
});

router.delete('/:id', user_restricted, mod_restricted, async (req, res) => {
  const { id } = req.params;
const item = await Categories.findById(id) 
      Categories.remove(id)
      .then(deleted => {
        log(req,  item )
        res.send("Success.")
      })
      .catch(err => { res.status(500).json({ message: 'Failed to delete category' }) });
});

module.exports = router;
