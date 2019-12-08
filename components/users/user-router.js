const express = require('express');

const Users = require('./user-model.js');

const bcrypt = require('bcryptjs')

const { user_restricted, mod_restricted, admin_restricted } = require('./restricted-middleware.js')

var owasp = require('owasp-password-strength-test');
owasp.config({
  allowPassphrases: false,
  minLength: 8
});


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
            res.json({ ...user, thumbnail, images })
          }).catch(err => { res.status(500).json({ message: 'Failed to get thumbnail.' }) });
        }).catch(err => { res.status(500).json({ message: 'Failed to get images.' }) });
      } else {
        res.status(404).json({ message: 'Could not find user with given id.' })
      }
    })
    .catch(err => { res.status(500).json({ message: 'Failed to get users' }); });
});

router.get('/dashboard', user_restricted, (req, res) => {
  const user = req.decodedToken.user;
  const id = user.user_id

  Users.findById(id)
    .then(userProfile => {
      res.json(userProfile)
    });
})

router.put('/edit', user_restricted, async (req, res) => {
  const changes = req.body;
  const user = req.decodedToken.user;
  const id = user.user_id
  //delete changes['user_role']
  delete changes['user_id']
  delete changes['user_verified']

  let errors = []
  let usernameSearch = false
  let emailSearch = false

  if (changes.password && changes.password != "") {
    var pwStrength = owasp.test(changes.password);
    errors = [...errors, ...pwStrength.errors]
    changes.password = bcrypt.hashSync(changes.password, 10)
  } else {
    delete changes.password
  }

  if (changes.username && (changes.username != user.username)) {
    usernameSearch = await Users.findByUsername(changes.username)
    if (usernameSearch) { errors.push("That username is taken.") }
  }

  if (changes.user_email && (changes.user_email != user.user_email)) {
    emailSearch = await Users.findByEmail(changes.user_email)
    if (emailSearch) { errors.push("THat email is taken.") }
  }

  if (errors.length === 0) {
    Users.update(changes, id)
      .then(updatedUser => {
        res.json(updatedUser);
      });
  } else {
    res.status(400).json({ message: 'Could not update user', error: errors });
  }



});

router.delete('/:id', user_restricted, admin_restricted, (req, res) => {
  const id = req.params.id

  Users.remove(id)
    .then(resposne => { res.json({ message: "User deleted." }) })
    .catch(err => {
      res.status(500).json({ message: 'Failed to delete user' });
    });

})



module.exports = router;
