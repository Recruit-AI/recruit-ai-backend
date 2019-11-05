const express = require('express');

const Users = require('./user-model.js');

const {user_restricted, mod_restricted, admin_restricted} = require('./restricted-middleware.js')
const {log} = require('../userLogs/log-middleware.js')

const router = express.Router();

//ALL items on this page are at least mod_restricted
router.use(user_restricted, mod_restricted)

//MODERATOR ROUTES
//Returns a list of users that can probably be searched
router.get('/user-list', (req, res) => {
  const searchTerm = req.query.search || ""

  Users.find(searchTerm)
  .then(users => {
    res.json(users);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get users' });
  });
});

//Makes it so that user can no longer log in.
router.post("/ban", (req, res) => {
  const id = req.body.user_id
  //Be sure to account for ban notes.
  Users.update({user_verified: false}, id)
  .then(response => res.json(response))
  .catch(err => { res.status(500).json({ message: 'Failed.' }) })

})

//Makes it so that user can log in again.
router.post("/unban", (req, res) => {
  const id = req.body.user_id
  //Be sure to account for ban notes.
  Users.update({user_verified: true}, id)
  .then(response => res.json(response))
  .catch(err => { res.status(500).json({ message: 'Failed.' }) })

})

//Accepts user_id and role_number. Make sure the user being demoted is not also an admin
router.post('/promote', admin_restricted, (req, res) => {
  const {user_id, user_role} = req.body
  Users.update({user_role}, user_id)
  .then(response => res.json(response))
  .catch(err => { res.status(500).json({ message: 'Failed.' }) })
})

module.exports = router;
