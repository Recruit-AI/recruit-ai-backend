const express = require('express');

const Users = require('./user-model.js');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//Possibly delete- const secrets = require('../../config/secrets.js');

const {user_restricted, mod_restricted, admin_restricted} = require('./restricted-middleware.js')
const {log} = require('../userLogs/log-middleware.js')

const router = express.Router();

const AuthRouter = require('./auth-router.js');
const AdminRouter = require('./admin-router.js');
router.use('/auth', AuthRouter);
router.use('/admin', AdminRouter);

router.get('/profile/:id', (req, res) => {
  const { id } = req.params;

  Users.findById(id)
  .then(user => {
    if (user) {
      Users.getImages(id).then(images => {
          Users.getThumbnail(id).then(thumbnail => {
              res.json({...user, thumbnail, images})
          }).catch(err => {res.status(500).json({ message: 'Failed to get thumbnail.' })});
      }).catch(err => {res.status(500).json({ message: 'Failed to get images.' })});
    } else {
      res.status(404).json({ message: 'Could not find user with given id.' })
    }
  })
  .catch(err => {res.status(500).json({ message: 'Failed to get users' });});
});

router.get('/dashboard', user_restricted, (req, res) => {
  const user = req.decodedToken.user;
  const id = user.user_id

    Users.findById(id)
    .then(userProfile => {
        res.json(userProfile)
      });
    })

router.post('/register', (req, res) => {
  const userData = req.body;
  userData.user_role = 1
  delete userData.user_id
  delete userData.user_verified

  userData.password = bcrypt.hashSync(userData.password, 10)

  Users.add(userData)
  .then(user => {
    if(user.user_id) {res.status(201).json(user)}
    else {res.status(500).json(user)};
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new user' });
  });
});

router.get("/verify/:id", (req, res) => {
  const id = req.params.id
  Users.update({user_verified: true}, id)
  .then(response => res.json(response))
  .catch(err => { res.status(500).json({ message: 'Failed.' }) })

})

module.exports = router;
