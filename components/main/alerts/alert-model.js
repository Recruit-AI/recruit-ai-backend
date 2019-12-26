const db = require('../../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  markRead,
  add,
  addAlert,
  update,
  remove,
};



function find(id, filter) {
  let query =  db('alerts')
  .where( 'alerts.alert_personnel_id', id)

  if(!filter) {
    query = query.whereNull('alert_state')
  } else {
    query = query.where('alert_state', filter)
  }
  return query
}

function findById(id) {
  return db('alerts')
    .where( 'alert_id', id )
    .first();
}

function markRead(id) {
  return db('alerts')
    .where('alert_id', id)
    .update({alert_state: "read"})
    .returning('alert_id')
    .then(res => {
      return findById(res[0])
    })
}


function add(alert) {
  return db('alerts')
    .insert(alert)
    .returning('alert_id')
    .then(res => {
      return findById(res[0])
    })
}

function addAlert(alert_athlete_id, alert_personnel_id, alert_type, alert_time) {
  
  return db('alerts')
    .insert({alert_athlete_id, alert_personnel_id, alert_type, alert_time})
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
