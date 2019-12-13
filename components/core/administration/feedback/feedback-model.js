const db = require('../../../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  add,
  update,
  remove
};


function find(filter) {
  return db('feedbacks')
  .where('logged', filter === 'logged')

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
    .update(changes)
    .returning('feedback_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    });
}

function remove(id) {
  return db('feedbacks')
    .where( 'feedback_id', id )
    .del();
}
