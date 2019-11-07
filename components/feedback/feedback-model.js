const db = require('../../data/dbConfig.js');

module.exports = {
  find,
  findUnlogged,
  findById,
  add,
  update,
  remove
};


function find() {
  return db('feedbacks')
}

function findUnlogged() {
  return db('feedbacks')
  .where('logged', false)
}

function findById(id) {
  return db('feedbacks')
    .where( 'feedback_id', id )
    .first();
}

function add(feedback) {
  return db('feedbacks')
    .insert(feedback)
    .returning('feedback_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

function update(changes, id) {
  return db('feedbacks')
    .where('feedback_id', id)
    .update(changes);
}

function remove(id) {
  return db('feedbacks')
    .where( 'feedback_id', id )
    .del();
}
