const db = require('../../../data/dbConfig.js');

module.exports = {
  find,
  getTeamSummary,
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
    query = query.where('athletes.team_id', team_id)
  }

  return query
}

const curr_month = Number.parseInt((new Date(Date.now())).getMonth())+1
const curr_year = (new Date(Date.now())).getFullYear()

function getTeamSummary(team_id, month=curr_month, year=curr_year) {
  const from = `${year}-${month}-01`;
  const to = `${month == 12 ? Number.parseInt(year)+1 : year}-${month == 12 ? 1 : Number.parseInt(month)+1}-01`;

  console.log(month, year, from, to)

  let query = db('messages')
    .leftJoin('end_users', 'messages.message_personnel_id', 'end_users.foreign_user_id')
    .leftJoin('athletes', 'messages.message_athlete_id', 'athletes.athlete_id')
    .where('messages.message_team_id', team_id)
    .whereBetween('created_at', [from, to])
    .orderBy([{ column: 'message_personnel_id' }, { column: 'message_athlete_id' }, { column: 'created_at' }])
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

function findByAthleteId(id, personnel_id, team_id, filter) {
  let query = db('messages')
    .leftJoin('teams', 'messages.message_team_id', 'teams.team_id')
    .leftJoin('end_users', 'messages.message_personnel_id', 'end_users.foreign_user_id')
    .leftJoin('athletes', 'messages.message_athlete_id', 'athletes.athlete_id')
    .where('message_athlete_id', id)

  if (filter === 'personal') {
    query = query.where('messages.message_personnel_id', personnel_id)
  } else {
    query = query.where('messages.message_team_id', team_id)
  }

  return query.orderBy('created_at', 'desc')
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
