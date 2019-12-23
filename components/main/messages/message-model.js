const db = require('../../../data/dbConfig.js');

module.exports = {
  find,
  findByAthleteId,
  findAthleteByNumber,
  add,
  update,
  remove,
};



function find(team_id, personnel_id, filter) {
  let query = db('athletes')
    .leftJoin('teams', 'athletes.team_id', 'teams.team_id')
    .leftJoin('end_users', 'athletes.recruiting_personnel_id', 'end_users.foreign_user_id')


  if (filter === 'personal') {
    query = query.where('athletes.recruiting_personnel_id', personnel_id)
  } else {
    query = query.where('athletes.athlete_team_id', team_id)
  }

  return query
}

function findById(id) {
  return db('messages')
    .where('message_id', id)
    .leftJoin('teams', 'messages.message_team_id', 'teams.team_id')
    .leftJoin('end_users', 'messages.message_personnel_id', 'end_users.foreign_user_id')
    .leftJoin('athletes', 'messages.message_athlete_id', 'athletes.athlete_id')
    .first();
}

function findByAthleteId(id) {
  return db('messages')
    .leftJoin('teams', 'messages.message_team_id', 'teams.team_id')
    .leftJoin('end_users', 'messages.message_personnel_id', 'end_users.foreign_user_id')
    .leftJoin('athletes', 'messages.message_athlete_id', 'athletes.athlete_id')
    .where('message_athlete_id', id).orderBy('created_at', 'desc')
}

function findAthleteByNumber(number) {
  return db('athletes')
    .where('phone', number.substring(2, number.length))
    .first()
}

function add(message) {
  return db('messages')
    .insert(message)
    .returning('message_id')
    .then(res => {
      return findById(res[0])
    })
}

function update(changes, id) {
  return db('messages')
    .where('message_id', id)
    .update(changes)
    .returning('message_id')
    .then(res => {
      return findById(res[0])
    })
}

function remove(id) {
  return db('messages')
    .where('message_id', id)
    .del();
}
