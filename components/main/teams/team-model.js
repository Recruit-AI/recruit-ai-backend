const db = require('../../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  findByName,
  findTeamMembers,
  add,
  update,
  remove,
};



function find(search) {
  if (search === '') {
    return db('teams').where('team_name', search)
  } else {
    return db('teams').where('team_name', 'iLIKE', `%${search}%`)
  }

}

function findById(id) {
  return db('teams')
    .where('team_id', id)
    .first();
}

function findByName(name, excludingId = null) {
  if (excludingId) {
    return db('teams')
      .where('team_name', name)
      .whereNot('team_id', excludingId)
      .first()
  } else {
    return db('teams')
      .where('team_name', name)
      .first()
  }
}

function findTeamMembers(id) {
  return db('teams')
    .join('end_users', 'teams.team_id', 'end_users.team_id')
    .join('users', 'users.user_id', 'end_users.foreign_user_id')
    .where('teams.team_id', id)
    .andWhere('team_verified', true)
    .select('user_display_name', 'foreign_user_id')
}

function add(team) {
  return db('teams')
    .insert(team)
    .returning('team_id')
    .then(res => {
      return findById(res[0])
    })
}

function update(changes, id) {
  return db('teams')
    .where('team_id', id)
    .update(changes)
    .returning('team_id')
    .then(res => {
      return findById(res[0])
    })
}

function remove(id) {
  return db('teams')
    .where('team_id', id)
    .del();
}
