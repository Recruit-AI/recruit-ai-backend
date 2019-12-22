const db = require('../../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  findPublicById,
  findAthleteByNumber,
  add,
  update,
  remove,
};



function find(team_id, personnel_id, filter) {
  let query = db('messages')
    .leftJoin('teams', 'messages.message_team_id', 'teams.team_id')
    .leftJoin('end_users', 'messages.message_personnel_id', 'end_users.foreign_user_id')
    .leftJoin('athletes', 'messages.message_athlete_id', 'athletes.athlete_id')


    if(filter === 'personal') {
      query = query.where( 'messages.message_personnel_id', personnel_id)
    } else if (filter === 'team') {
      query = query.where( 'messages.message_team_id', team_id)
    }
    
  return query
}

function findById(id) {
  return db('messages')
    .leftJoin('teams', 'messages.message_team_id', 'teams.team_id')
    .leftJoin('end_users', 'messages.message_personnel_id', 'end_users.foreign_user_id')
    .leftJoin('athletes', 'messages.message_athlete_id', 'athletes.athlete_id')
    .where('message_id', id)
    .first();
}

function findAthleteByNumber(number) {
  return db('athletes')
  .where('phone', number.substring(2, number.length))
  .first()
}

function findPublicById(id) {
  return db('messages')
    .leftJoin('teams', 'messages.message_team_id', 'teams.team_id')
    .leftJoin('end_users', 'messages.message_personnel_id', 'end_users.foreign_user_id')
    .leftJoin('athletes', 'messages.message_athlete_id', 'athletes.athlete_id')
    .where('message_id', id)
    .select(
      'message_id',
      'message_athlete_id',
      'message_personnel_id',
      'message_team_id',
      'message_status',
      'time_options',
      'chosen_time',
      'user_display_name',
      'preferred_name',
      'first_name',
      'last_name',
      'reporting_address', 'message_reporting_address',
      'reporting_instructions', 'message_reporting_instructions',
      'email', 'phone', 'city', 'state'
    )
    .first();
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
