const express = require('express');

const SupportTickets = require('./support_ticket-model.js');
const paginate = require('jw-paginate')

const router = express.Router();
const authenticate = require('../../accounts/restricted-middleware.js')

router.get('/', authenticate.admin_restricted, (req, res) => {
  const filter = req.query.filter || ""
  const kind = req.query.kind || ""

  //filter- "unread", "open", "closed"

  SupportTickets.find(filter, kind)
    .then(items => {
      // get page from query params or default to first page
      const page = parseInt(req.query.page) || 1;

      // get pager object for specified page
      const pageSize = 10;
      const pager = paginate(items.length, page, pageSize);

      // get page of items from items array
      const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

      // return pager object and current page of items
      return res.json({pager, pageOfItems});
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get items' });
    });
});

router.get('/:id', authenticate.admin_restricted, (req, res) => {
  const { id } = req.params;

  SupportTickets.findById(id)
  .then(support_ticket => {
    if (support_ticket) {
      res.json(support_ticket)
    } else {
      res.status(404).json({ message: 'Could not find support_ticket with given id.' })
    }
  })
  .catch(err => {res.status(500).json({ message: 'Failed to get support_tickets' });});
});


router.post('/', (req, res) => {
  const support_ticketData = req.body;

  SupportTickets.add(support_ticketData)
  .then(support_ticket => {
    res.status(201).json(support_ticket);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new support_ticket' });
  });

});

router.put('/:id', authenticate.admin_restricted, (req, res) => {
  const { id } = req.params;
  const changes = req.body

  SupportTickets.update(changes, id)
  .then(updatedSupportTicket => {
    res.json(updatedSupportTicket);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update support_ticket' });
  });

});

router.delete('/:id', authenticate.admin_restricted, (req, res) => {
  const { id } = req.params;
  SupportTickets.remove(id)
  .then(deleted => {
    res.send("Success.")
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to delete support_ticket' })
  });
});

module.exports = router;
