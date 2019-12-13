const express = require('express');
const paginate = require('jw-paginate')
const router = express.Router();

const SitePages = require('./site_page-model.js');

const { log } = require('../../administration/userLogs/log-middleware.js')
const authenticate = require('../../accounts/restricted-middleware.js')

router.get('/', (req, res) => {
  SitePages.find()
    .then(site_pages => {
      res.json(site_pages)
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get site_pages' });
    });
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const site_page = await SitePages.findById(id)
  if (site_page) {
    res.json(site_page)
  } else {
    res.status(404).json({ message: 'Could not find site_page with given id.' })
  }

});

router.post('/', authenticate.user_restricted, async (req, res) => {
  const site_pageData = req.body;

  if (await SitePages.findByName(site_pageData.page_title)) {
    res.status(400).json({ message: "A record with this name already exists." })
  } else {
    SitePages.add(site_pageData)
      .then(site_page => {
        log(req, {}, site_page)
        res.status(201).json(site_page);
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to create new site_page', err: site_pageData });
      });
  }
});


router.put('/:id', authenticate.user_restricted, async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  if (await SitePages.findByName(changes.site_page_name, id)) {
    res.status(400).json({ message: "A record with this name already exists." })
  } else {
    SitePages.update(changes, id)
      .then(updatedSitePage => {
        log(req, site_page)
        res.json(updatedSitePage);
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to update site_page' });
      });
  }
});


router.delete('/:id', authenticate.user_restricted, async (req, res) => {
  const { id } = req.params;

  const site_page = await SitePages.findById(id)

  SitePages.remove(id)
    .then(deleted => {
      log(req, site_page)
      res.send("Success.")
    })
    .catch(err => { res.status(500).json({ message: 'Failed to delete site_page' }) });

});


module.exports = router;
