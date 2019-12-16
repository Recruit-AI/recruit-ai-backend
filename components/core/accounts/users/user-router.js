const express = require('express');
const router = express.Router();
const authenticate = require('../restricted-middleware.js')

const Users = require('./user-model.js');
const Images = require('../../content/images/image-model.js');

const userKindsInfo = require('./userKinds/user_kinds-model')

const AuthRouter = require('./auth/auth-router.js');
const AdminRouter = require('./auth/admin-router.js');
router.use('/auth', AuthRouter);
router.use('/admin', AdminRouter);

router.get('/profile/:id', async (req, res) => {
  const { id } = req.params;

  const user = await Users.findById(id)

  const UserKindDb = userKindsInfo(user.user_kind)
  const userInfo = await UserKindDb.findByUserId(id)
  const thumbnail = await Images.getThumbnail('User', id)

  res.json({ ...user, userInfo, thumbnail })

});

router.get('/dashboard', authenticate.user_restricted, (req, res) => {
  const user = req.decodedToken.user;
  const id = user.user_id

  Users.findById(id)
    .then(userProfile => {
      res.json(userProfile)
    });
})

router.delete('/:id', authenticate.admin_restricted, (req, res) => {
  const id = req.params.id

  Users.remove(id)
    .then(resposne => { res.json({ message: "User deleted." }) })
    .catch(err => {
      res.status(500).json({ message: 'Failed to delete user' });
    });

})



module.exports = router;
