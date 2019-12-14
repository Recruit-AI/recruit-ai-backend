const express = require('express');
const paginate = require('jw-paginate')
const router = express.Router();

const SiteBlogs = require('./site_blog-model.js');

const Images = require('../images/image-model.js');
const { log } = require('../../administration/userLogs/log-middleware.js')
const authenticate = require('../../accounts/restricted-middleware.js')

router.get('/', (req, res) => {
  const sort = req.query.sort || "blog_title"
  const category = req.query.category || "Blog"
  const tag = req.query.tag  || ""
  const sortdir = req.query.sortdir || "ASC"
  const searchTerm = req.query.search || ""

  SiteBlogs.find(sort, sortdir, searchTerm, category, tag)
    .then(site_blogs => {

      // get page from query params or default to first page
      const page = parseInt(req.query.page) || 1;

      // get pager object for specified page
      const pageSize = 10;
      const pager = paginate(site_blogs.length, page, pageSize);

      // get page of site_blogs from site_blogs array
      const pageOfSiteBlogs = site_blogs.slice(pager.startIndex, pager.endIndex + 1);

      // return pager object and current page of site_blogs
      return res.json({
        pager, pageOfSiteBlogs: pageOfSiteBlogs.map(
          site_blog => ({
            ...site_blog,
            thumbnail: site_blog.image_url ? {
               image_url: site_blog.image_url,
               image_title: site_blog.image_title,
               image_source: site_blog.image_source,
               image_description: site_blog.image_description,
               image_id: site_blog.image_id
            } : {}
          })
        )
      });

    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get site_blogs' });
    });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const site_blog = await SiteBlogs.findById(id)
  if (site_blog) {
    const thumbnail = await Images.getThumbnail('SiteBlog', id)
    res.json({ ...site_blog, thumbnail })
  } else {
    res.status(404).json({ message: 'Could not find site_blog with given id.' })
  }

});

router.post('/', authenticate.user_restricted, async (req, res) => {
  const site_blogData = req.body;
  site_blogData.author_id = req.decodedToken.user.user_id

  if (await SiteBlogs.findByName(site_blogData.blog_title)) {
    res.status(400).json({ message: "A record with this name already exists." })
  } else {
    SiteBlogs.add(site_blogData)
      .then(site_blog => {
        log(req, {}, site_blog)
        res.status(201).json(site_blog);
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to create new site_blog', err: site_blogData });
      });
  }
});


router.put('/:id', authenticate.user_restricted, async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  const site_blog = await SiteBlogs.findById(id)

  if (await SiteBlogs.findByName(changes.blog_title, id)) {
    res.status(400).json({ message: "A record with this name already exists." })
  } else {
    SiteBlogs.update(changes, id)
      .then(updatedSiteBlog => {
        log(req, site_blog)
        res.json(updatedSiteBlog);
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to update site_blog' });
      });
  }
});


router.delete('/:id', authenticate.user_restricted, async (req, res) => {
  const { id } = req.params;

  const site_blog = await SiteBlogs.findById(id)

  SiteBlogs.remove(id)
    .then(deleted => {
      log(req, site_blog)
      res.send("Success.")
    })
    .catch(err => { res.status(500).json({ message: 'Failed to delete site_blog' }) });

});


module.exports = router;
