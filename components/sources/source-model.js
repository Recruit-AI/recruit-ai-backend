const db = require('../../data/dbConfig.js');

module.exports = {
  find,
  getSources,
  findById,
  add,
  update,
  remove
};



function find() {
  return db('sources')
}

function getSources(foreign_class, foreign_id) {
  return db('sources')
    .where( 'foreign_class', foreign_class )
    .where( 'foreign_key', foreign_id)
}

function findById(id) {
  return db('sources')
    .where( 'source_id', id )
    .first();
}

function add(source) {
  return db('sources')
    .insert(source)
    .returning('source_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

function update(changes, id) {
  return db('sources')
    .where('source_id', id)
    .update(changes);
}

function remove(id) {
  return db('sources')
    .where( 'source_id', id )
    .del();
}
