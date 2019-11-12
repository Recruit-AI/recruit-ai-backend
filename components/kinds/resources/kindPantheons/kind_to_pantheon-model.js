const db = require('../../../../data/dbConfig.js');

module.exports = {
  findByKind,
  findById,
  add,
  update,
  remove
};




function findByKind(id) {
  return db('kinds_to_pantheons')
  .leftJoin('pantheons', 'kinds_to_pantheons.kp_pantheon_id', 'pantheons.pantheon_id')
  .select('kinds_to_pantheons_id', 'pantheon_id', 'kp_pantheon_id', 'kp_description', 'pantheon_name', 'pantheon_description')
  .where('kp_kind_id', id)
}

function findById(id) {
  return db('kinds_to_pantheons')
    .where( 'kinds_to_pantheons_id', id )
    .first();
}

function add(kind_to_pantheon) {
  return db('kinds_to_pantheons')
    .insert(kind_to_pantheon)
    .returning('kinds_to_pantheons_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

function update(changes, id) {
  return db('kinds_to_pantheons')
    .where('kinds_to_pantheons_id', id)
    .update(changes);
}

function remove(id) {
  return db('kinds_to_pantheons')
    .where( 'kinds_to_pantheons_id', id )
    .del();
}
