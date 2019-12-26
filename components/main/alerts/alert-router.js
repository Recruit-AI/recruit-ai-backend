const express = require('express');
const router = express.Router();
const paginate = require('jw-paginate')

const Alerts = require('./alert-model.js');

const { log } = require('../../core/administration/userLogs/log-middleware.js')
const authenticate = require('../../core/accounts/restricted-middleware.js')

//Should retrieve all the alerts for the user
router.get('/', authenticate.user_restricted, async (req, res) => {
  const user = req.decodedToken.user


  const alerts = await Alerts.find(user.user_id, req.query.filter)
 
  if (alerts) {
    // get page from query params or default to first page
    const page = parseInt(req.query.page) || 1;

    // get pager object for specified page
    const pageSize = 15;
    const pager = paginate(alerts.length, page, pageSize);

    // get page of site_blogs from site_blogs array
    const pageOfItems = alerts.slice(pager.startIndex, pager.endIndex + 1);

    // return pager object and current page of site_blogs
    return res.json({pager, pageOfItems});
  } else {
    res.status(404).json({ message: 'Could not find message with given id.' })
  }

})

//mark the alert as read
router.get('/read/:id', async (req, res) => {
  const { id } = req.params;

  let alert = await Alerts.markRead(id)
  if (alert) {
    res.json(alert)
  } else {
    res.status(404).json({ message: 'Could not find alert with given id.' })
  }

});



module.exports = router;
