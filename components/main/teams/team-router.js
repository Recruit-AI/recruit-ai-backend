const express = require('express');
const router = express.Router();

const Teams = require('./team-model.js');
const userKindsInfo = require('../../core/accounts/users/userKinds/user_kinds-model');


const Alerts = require('../alerts/alert-model.js');

const { log } = require('../../core/administration/userLogs/log-middleware.js')
const authenticate = require('../../core/accounts/restricted-middleware.js')

router.get('/', (req, res) => {
  const search = req.query.search || ""
  Teams.find(search)
    .then(teams => {
      res.json(teams)
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get teams' });
    });
})

//An existing team looking at the requests
router.get('/join-requests', authenticate.team_owner_restricted, async(req, res) => {
  const user = req.decodedToken.user

  const UserKindDb = userKindsInfo(user.user_kind)
  const users = await UserKindDb.findJoinRequestsByTeamId(user.userInfo.team_id)

  res.json(users)
})


router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const team = await Teams.findById(id)
  if (team) {
    const teamMembers = await Teams.findTeamMembers(id)
    team.teamMembers = teamMembers
    res.json(team)
  } else {
    res.status(404).json({ message: 'Could not find team with given id.' })
  }

});

router.post('/', authenticate.user_restricted, async (req, res) => {
  const teamData = req.body;
  const user = req.decodedToken.user
  teamData.account_moderator_id = user.user_id

  if (await Teams.findByName(teamData.team_name)) {
    res.status(400).json({ message: "A record with this name already exists." })
  } else {
    const team = await Teams.add(teamData)
    let infoData = {}
    infoData.team_id = team.team_id
    infoData.team_verified = true

    const UserKindDb = userKindsInfo(user.user_kind)
    UserKindDb.updateByUserId(infoData, user.user_id)
    user.userInfo = {...user.userInfo, team_id: team.team_id, team_verified: true}

    res.status(201).json({team, user});
  }
});

//A new account requesting to join a team
router.get('/join/:id', authenticate.user_restricted, async(req, res) => {
  const id = req.params.id
  const user = req.decodedToken.user
  let infoData = {}
  infoData.team_id = id
  infoData.team_verified = false
  const UserKindDb = userKindsInfo(user.user_kind)
  UserKindDb.updateByUserId(infoData, user.user_id)
  user.userInfo = {...user.userInfo, team_id: id, team_verified: false}

  team = await Teams.findById(id)
  alert = await Alerts.addAlert(null, team.account_moderator_id , "new-team-request")


  res.json({message: "Request sent. Please await verification from the owner of that team.", user })
})


//An existing team accepting a request
router.get('/verify/:user_id', authenticate.team_owner_restricted, async(req, res) => {
  const user = req.decodedToken.user
  let infoData = {}
  infoData.team_id = user.userInfo.team_id
  infoData.team_verified = true
  const UserKindDb = userKindsInfo('end_user')
  UserKindDb.updateByUserId(infoData, req.params.user_id)
  res.json({message: "Added to the team."})
})

//An existing team denying a request
router.get('/decline/:user_id', authenticate.team_owner_restricted, async(req, res) => {
  const user = req.decodedToken.user
  let infoData = {}
  infoData.team_verified = null
  infoData.team_id = null
  const UserKindDb = userKindsInfo('end_user')
  UserKindDb.updateByUserId(infoData, req.params.user_id)
  res.json({message: "Removed from the team."})

})

router.put('/:id', authenticate.team_owner_restricted, async (req, res) => {
  const { id } = req.params;
  const changes = req.body;


  const team = await Teams.findById(id)
  if (await Teams.findByName(changes.team_name, id)) {
    res.status(400).json({ message: "A record with this name already exists." })
  } else {
    Teams.update(changes, id)
      .then(updatedTeam => {
        res.json(updatedTeam);
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to update team' });
      });
  }
});


router.delete('/:id', authenticate.team_owner_restricted, async (req, res) => {
  const { id } = req.params;

  const team = await Teams.findById(id)

  Teams.remove(id)
    .then(deleted => {
      res.send("Success.")
    })
    .catch(err => { res.status(500).json({ message: 'Failed to delete team' }) });

});


module.exports = router;
