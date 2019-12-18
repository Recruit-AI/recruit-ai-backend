const db = require('../../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  add,
  update,
  remove,
};



function find(id) {
  return db('visits')
    .leftJoin('teams', 'visits.visit_team_id', 'teams.team_id')
    .leftJoin('end_users', 'visits.visit_personnel_id', 'end_users.foreign_user_id')
    .leftJoin('athletes', 'visits.visit_team_id', 'athletes.athlete_id')
    .where('visit_personnel_id', id)


}

function findById(id) {
  return db('visits')
    .leftJoin('teams', 'visits.visit_team_id', 'teams.team_id')
    .leftJoin('end_users', 'visits.visit_personnel_id', 'end_users.foreign_user_id')
    .leftJoin('athletes', 'visits.visit_team_id', 'athletes.athlete_id')
    .where('visit_id', id)
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
