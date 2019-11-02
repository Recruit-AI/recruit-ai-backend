const express = require('express');

const Users = require('./user-model.js');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secrets = require('../../config/secrets.js');

const {user_restricted, mod_restricted, admin_restricted} = require('./restricted-middleware.js')

const router = express.Router();

router.post('/login', (req, res) => {
  let {username, password} = req.body

  Users.findByUsername(username)
  .then(user => {
    if(user && bcrypt.compareSync(password, user.password) && user.user_verified){
      const token = generateToken(user)
      res.status(200).json({message: "Welcome!", token: token, user: user})
    } else {
      res.status(500).json({message: "Invalid Credentials."})
    }
  })
  .catch(error => {
    res.status(500).json({message: "Invalid Credentials."})
  })
});



router.delete('/logout', user_restricted, (req, res) => {
  res.status(200).json({message: "Logged out!"})
});


router.put('/edit', user_restricted, (req, res) => {
  const changes = req.body;
  const user = req.decodedToken.user;
  const id = user.user_id
  delete changes['user_role']
  delete changes['user_id']
  delete changes['user_verified']

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


function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    user: user
  };

  const options = {
    expiresIn: '1d', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, process.env.JWT_SECRET, options); // this method is synchronous
}

module.exports = router;
