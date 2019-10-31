const jwt = require('jsonwebtoken')

function user_restricted(req, res, next) {
  const token = req.headers.authorization
  if(token){
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if(err){
        res.status(401).json({message: "Error.", error: err});
        return
      } else {
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
  req.decodedToken.user.user_role >= 2 ? next() : false
}

function admin_restricted(req, res, next) {
  req.decodedToken.user.user_role >= 3 ? next() : false
}

module.exports = {user_restricted, mod_restricted, admin_restricted}
