const db = require('../../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  findPublicById,
  add,
  update,
  remove,
};



function find(team_id, personnel_id, status, filter) {
  let query = db('visits')
    .leftJoin('teams', 'visits.visit_team_id', 'teams.team_id')
    .leftJoin('end_users', 'visits.visit_personnel_id', 'end_users.foreign_user_id')
    .leftJoin('athletes', 'visits.visit_team_id', 'athletes.athlete_id')


    if(filter === 'personal') {
      query = query.where( 'visits.visit_personnel_id', personnel_id)
    } else if (filter === 'team') {
      query = query.where( 'visits.visit_team_id', team_id)
    }

    if(status !== 'all') {
      query = query.where('visit_status', status)
    }

    
  return query
}

function findById(id) {
  return db('visits')
    .leftJoin('teams', 'visits.visit_team_id', 'teams.team_id')
    .leftJoin('end_users', 'visits.visit_personnel_id', 'end_users.foreign_user_id')
    .leftJoin('athletes', 'visits.visit_team_id', 'athletes.athlete_id')
    .where('visit_id', id)
    .first();
}

function findPublicById(id) {
  return db('visits')
    .leftJoin('teams', 'visits.visit_team_id', 'teams.team_id')
    .leftJoin('end_users', 'visits.visit_personnel_id', 'end_users.foreign_user_id')
    .leftJoin('athletes', 'visits.visit_team_id', 'athletes.athlete_id')
    .where('visit_id', id)
    .select(
      'visit_id',
      'visit_athlete_id',
      'visit_personnel_id',
      'visit_team_id',
      'time_options',
      'chosen_time',
      'user_display_name',
      'preferred_name',
      'first_name',
      'last_name',
      'reporting_address', 'visit_reporting_address',
      'reporting_instructions', 'visit_reporting_instructions',
      'email', 'phone', 'city', 'state'
    )
    .first();
}


function add(visit) {
  return db('visits')
    .insert(visit)
    .returning('visit_id')
    .then(res => {
      return findById(res[0])
    })
}

function update(changes, id) {
  return db('visits')
    .where('visit_id', id)
    .update(changes)
    .returning('visit_id')
    .then(res => {
      return findById(res[0])
    })
}

function remove(id) {
  return db('visits')
    .where('visit_id', id)
    .del();
}
