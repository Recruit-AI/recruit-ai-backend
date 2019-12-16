
const jwt = require('jsonwebtoken')
const Users = require('./users/user-model.js')

const userKindsInfo = require('./users/userKinds/user_kinds-model')

const getToken = async (req, res) => {
  const token = req.headers.authorization
  let ret = false;
  if (token) {
    await jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        ret = false
      }
      else {
        let retUser = await Users.findById(decodedToken.user.user_id)
        const UserKindDb = userKindsInfo(retUser.user_kind)
        const userInfo = await UserKindDb.findByUserId(retUser.user_id)
        retUser.userInfo = userInfo
        decodedToken.user = retUser
        if(decodedToken.user) {
          req.decodedToken = decodedToken
          ret = true
        } else {
          ret = false
        }
      }
    })
  }
  return ret
}

const check_permission = (value, req, res) => {
  if (req.decodedToken) {
    return req.decodedToken.user.user_role >= value
  } else {
    return false
  }
}

const restrictRoute = async (value, req, res, next) => {
  if (await getToken(req, res)) {
    if (check_permission(value, req, res)) {
      next();
    } else {
      res.status(500).json({ message: "Permission missing." })
    }
  } else {
    res.status(500).json({ message: "You need to be logged in." })
  }
}

const user_restricted = (req, res, next) => {
  restrictRoute(1, req, res, next)
}

const mod_restricted = (req, res, next) => {
  restrictRoute(2, req, res, next)
}

const admin_restricted = (req, res, next) => {
  restrictRoute(3, req, res, next)
}

module.exports = { user_restricted, mod_restricted, admin_restricted }
