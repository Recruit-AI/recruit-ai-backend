const express = require('express');

const Users = require('./user-model.js');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secrets = require('../../config/secrets.js');

const {user_restricted, mod_restricted, admin_restricted} = require('../middleware.js')

const router = express.Router();

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

router.post('/register', (req, res) => {
  const userData = req.body;
  userData.user_role = 1
  delete userData.user_id
  delete userData.user_verified

  userData.password = bcrypt.hashSync(userData.password, 10)

  Users.add(userData)
  .then(user => {
    res.status(201).json(user);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new user' });
  });
});

router.post("/verify", (req, res) => {
  const id = req.body.user_id
  Users.update({user_verified: true}, id)
  .then(response => res.json(response))
  .catch(err => { res.status(500).json({ message: 'Failed.' }) })

})

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


router.get('/dashboard', user_restricted, (req, res) => {
  const user = req.decodedToken.user;
  const id = user.user_id

    Users.findById(id)
    .then(userProfile => {
        res.json(userProfile)
      });
    })

router.delete('/logout', (req, res) => {
  req.session.user = null;
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

router.delete('/', user_restricted, (req, res) => {
  const user = req.decodedToken.user;
  const id = user.user_id

      Users.remove(id)
      .then(deleted => {
        res.send("Success.")
      })
      .catch(err => { res.status(500).json({ message: 'Failed to delete user' }) });
});

//MODERATOR ROUTES
//Returns a list of users that can probably be searched
router.get('/admin-list', user_restricted, mod_restricted, (req, res) => {
  Users.find()
  .then(users => {
    res.json(users);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get users' });
  });
});

//Makes it so that user can no longer log in. Add a "ban_notes" field to a user account
router.post("/ban", user_restricted, mod_restricted, (req, res) => {
  const id = req.body.user_id
  Users.update({user_verified: false}, id)
  .then(response => res.json(response))
  .catch(err => { res.status(500).json({ message: 'Failed.' }) })

})

//Makes it so that user can log in again. Add a "ban_notes" field to a user account
router.post("/unban", user_restricted, mod_restricted, (req, res) => {
  const id = req.body.user_id
  Users.update({user_verified: true}, id)
  .then(response => res.json(response))
  .catch(err => { res.status(500).json({ message: 'Failed.' }) })

})

//Accepts user_id and role_number. Make sure the user being demoted is not also an admin
router.post('/promote', user_restricted, admin_restricted, (req, res) => {
  const {user_id, user_role} = req.body
  Users.update({user_role}, user_id)
  .then(response => res.json(response))
  .catch(err => { res.status(500).json({ message: 'Failed.' }) })
})

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
