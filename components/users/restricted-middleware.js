
const jwt = require('jsonwebtoken')
const Users = require('./user-model.js')

const user_restricted =  (req, res, next) => {
  const token = req.headers.authorization
  if(token){
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if(err){
        res.status(401).json({message: "Error.", error: err});
        return
      } else {
        decodedToken.user = await Users.findById(decodedToken.user.user_id)
        req.decodedToken = decodedToken
        next();
      }
    })
  }else{
    res.status(400).json({message: "No token provided."})
    return
  }
}

function mod_restricted(req, res, next) {
  req.decodedToken.user.user_role >= 2 ? next() : res.status(500).send("Permission missing.")
}

function admin_restricted(req, res, next) {
  req.decodedToken.user.user_role >= 3 ? next() : res.status(500).send("Permission missing.")
}

module.exports = {user_restricted, mod_restricted, admin_restricted}
