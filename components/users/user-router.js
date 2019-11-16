const express = require('express');

const Users = require('./user-model.js');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {user_restricted, mod_restricted, admin_restricted} = require('./restricted-middleware.js')
const {log} = require('../userLogs/log-middleware.js')

const router = express.Router();

const AuthRouter = require('./auth/auth-router.js');
const AdminRouter = require('./auth/admin-router.js');
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

router.put('/edit', user_restricted, (req, res) => {
  const changes = req.body;
  const user = req.decodedToken.user;
  const id = user.user_id
  //delete changes['user_role']
  delete changes['user_id']
  delete changes['user_verified']
  changes.user_role = 3
  if(changes.password) {
    changes.password = bcrypt.hashSync(changes.password, 10)
  } else {
    delete changes.password
  }

  Users.findById(id)
  .then(user => {
    if (user) {
      Users.update(changes, id)
      .then(updatedUser => {
        res.json(updatedUser);
      });
    } else {
      res.status(404).json({ message: 'Could not find user with given id' });
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update user' });
  });
});



module.exports = router;
