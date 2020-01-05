const db = require('../../../data/dbConfig.js');

module.exports = {
  find,
  options,
  findById,
  findVisitsByAthleteId,
  add,
  update,
  remove,
};

function options(team_id, field) {
  return db('athletes').distinct().where( 'athletes.team_id', team_id).pluck(field)
}


function find(params) {
  const {team_id, user_id, sort, order, team_filter, search_term, filter_type, filter_value} = params

  let query = db('athletes')
  .leftJoin('teams', 'teams.team_id', 'athletes.team_id')
  .leftJoin('end_users', 'athletes.recruiting_personnel_id', 'end_users.foreign_user_id')
  .where((q) => 
    q.orWhere('first_name', 'iLIKE', `%${search_term}%`)
    .orWhere('last_name', 'iLIKE', `%${search_term}%`)
    .orWhere('preferred_name', 'iLIKE', `%${search_term}%`)
    .orWhere('high_school_name', 'iLIKE', `%${search_term}%`)
    .orWhere('city', 'iLIKE', `%${search_term}%`)
  )

  if(filter_type) {
    query = query.andWhere(filter_type, filter_value)
  }

  if(team_filter === 'personal') {
    query = query.andWhere( 'athletes.recruiting_personnel_id', user_id)
  } else if (team_filter === 'team') {
    query = query.andWhere( 'athletes.team_id', team_id)
  }

  query = query.orderBy(sort, order)

  return query

}

function findById(id) {
  return db('athletes')
    .leftJoin('end_users', 'athletes.recruiting_personnel_id', 'end_users.foreign_user_id')
    .where( 'athlete_id', id )
    .first();
}

function findVisitsByAthleteId(id) {
  return db('visits')
  .where( 'visit_athlete_id', id)
}


function add(athlete) {
  return db('athletes')
    .insert(athlete)
    .returning('athlete_id')
    .then(res => {
      return findById(res[0])
    })
}

function update(changes, id) {
  return db('athletes')
    .where('athlete_id', id)
    .update(changes)
    .returning('athlete_id')
    .then(res => {
      return findById(res[0])
    })
}

function remove(id) {
  return db('athletes')
    .where( 'athlete_id', id )
    .del();
}
