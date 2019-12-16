const db = require('../../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  findByName,
  add,
  update,
  remove,
};



function find() {
  return db('teams')

}

function findById(id) {
  return db('teams')
    .where( 'team_id', id )
    .first();
}

function findByName(name, excludingId = null) {
  if(excludingId) {
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
    .where( 'team_id', id )
    .del();
}
