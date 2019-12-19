const db = require('../../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  findVisitsByAthleteId,
  add,
  update,
  remove,
};



function find(team_id, personnel_id, sort, sortOrder, filter) {
  let query = db('athletes')
  .leftJoin('teams', 'teams.team_id', 'athletes.team_id')
  .leftJoin('end_users', 'athletes.recruiting_personnel_id', 'end_users.foreign_user_id')

  if(filter === 'personal') {
    query = query.where( 'athletes.recruiting_personnel_id', personnel_id)
  } else if (filter === 'team') {
    query = query.where( 'athletes.team_id', team_id)
  }

  query = query.orderBy(sort, sortOrder)

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
