const jwt = require('jsonwebtoken')

function user_restricted(req, res, next) {
  // const token = req.headers.authorization
  //
  // console.log(process.env.JWT_SECRET, token)
  // if(token){
  //   jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
  //     console.log("INSIDE VERIFY")
  //     if(err){
  //       console.log(err)
  //       res.status(401).json({message: "Error.", error: err})
  //     } else {
  //       next();
  //     }
  //   })
  // }else{
  //   req.decodedToken = decodedToken
  //   res.status(400).json({message: "No token provided."})
  // }
  next();
}

function mod_restricted(req, res, next) {
  user_restricted(req,res,next);
}

function admin_restricted(req, res, next) {
  user_restricted(req,res,next);
}

module.exports = {user_restricted, mod_restricted, admin_restricted}
