
const jwt = require('jsonwebtoken')
const Users = require('./users/user-model.js')

const Teams = require('../../main/teams/team-model.js');

const userKindsInfo = require('./users/userKinds/user_kinds-model')


//----------------------------------------
//PUBLIC Middleware
//----------------------------------------
const user_restricted = (req, res, next) => {
  restrictRoute(1, req, res, next)
}

const mod_restricted = (req, res, next) => {
  restrictRoute(2, req, res, next)
}

const admin_restricted = (req, res, next) => {
  restrictRoute(3, req, res, next)
}

const team_restricted = async (req, res, next) => {
  if(await verify_team(req, res)) { next(); }
  else { res.status(400).json({message: "You are not authorized for this team; or you are awaiting verification."}) }
}

const team_owner_restricted = async (req, res, next) => {
  if(await verify_team(req, res)) {
    const team = await Teams.findById(req.decodedToken.verified_team_id)

    if(team.account_moderator_id === req.decodedToken.user.user_id ) {
      next();
    } else {
      res.status(400).json({message: "Only the owner of this team has this permission."})
    }
  }
  else {
    res.status(400).json({message: "You are not authorized for this team; or you are awaiting verification."})
  }
}

//----------------------------------------
//PUBLIC Helpers
//----------------------------------------
const check_team = (req, team_id) => {
  return req.decodedToken.verified_team_id === team_id
}

//------------------------------------------------------------
//Export Public functions ------------------------------------
//------------------------------------------------------------
module.exports = { user_restricted, mod_restricted, admin_restricted, team_restricted, team_owner_restricted, check_team }
//------------------------------------------------------------


//----------------------------------------
//PRIVATE Helpers
//----------------------------------------
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

const verify_team = async (req, res) => {
  if(await getToken(req, res)) {
    const userInfo = req.decodedToken.user.userInfo
    if(userInfo.team_verified) {
      req.decodedToken.verified_team_id = userInfo.team_id
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
