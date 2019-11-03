const db = require('../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  add,
  update,
  remove
};



function find() {
  return db('logs')
}

function findById(id) {
  return db('logs')
    .where( 'log_id', id )
    .first();
}

function add(log) {
  return db('logs')
    .insert(log)
    .returning('log_id')
    .then(res => {
      return findById(res[0])
    })
}

function update(changes, id) {
  return db('logs')
    .where('log_id', id)
    .update(changes)
    .returning('log_id')
    .then(res => {
      return findById(res[0])
    })
}

function remove(id) {
  return db('logs')
    .where( 'log_id', id )
    .del();
}
