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
  .where('visit_personnel_id', id)

}

function findById(id) {
  return db('visits')
    .where( 'visit_id', id )
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
    .where( 'visit_id', id )
    .del();
}
