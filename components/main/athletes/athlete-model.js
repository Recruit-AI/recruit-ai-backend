const db = require('../../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  add,
  update,
  remove,
};



function find(team_id, sort='preferred_name', sortOrder='ASC') {
  return db('athletes')
  .leftJoin('teams', 'teams.team_id', 'athletes.team_id')
  .leftJoin('end_users', 'athletes.recruiting_personnel_id', 'end_users.foreign_user_id')
  .where( 'athletes.team_id', team_id)
  .orderBy(sort, sortOrder)

}

function findById(id) {
  return db('athletes')
    .where( 'athlete_id', id )
    .first();
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