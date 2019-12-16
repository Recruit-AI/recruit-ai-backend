const db = require('../../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  add,
  update,
  remove,
};



function find() {
  return db('athletes')

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
