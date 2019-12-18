const db = require('../../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  add,
  update,
  remove,
};



function find(id) {
  return db('alerts')
  .where( 'alerts.alert_personnel_id', id)

}

function findById(id) {
  return db('alerts')
    .where( 'alert_id', id )
    .first();
}


function add(alert) {
  return db('alerts')
    .insert(alert)
    .returning('alert_id')
    .then(res => {
      return findById(res[0])
    })
}

function update(changes, id) {
  return db('alerts')
    .where('alert_id', id)
    .update(changes)
    .returning('alert_id')
    .then(res => {
      return findById(res[0])
    })
}

function remove(id) {
  return db('alerts')
    .where( 'alert_id', id )
    .del();
}
