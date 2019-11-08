const db = require('../../../../data/dbConfig.js');

module.exports = {
  findByCategory,
  findById,
  add,
  update,
  remove
};




function findByCategory(id) {
  return db('category_to_pantheons')
  .leftJoin('pantheons', 'category_to_pantheons.cpa_pantheon_id', 'pantheons.pantheon_id')
  .select('category_pantheon_id', 'pantheon_id', 'cpa_description', 'pantheon_name', 'pantheon_description')
  .where('cpa_category_id', id)
}

function findById(id) {
  return db('category_to_pantheons')
    .where( 'category_pantheon_id', id )
    .first();
}

function add(category_to_pantheon) {
  return db('category_to_pantheons')
    .insert(category_to_pantheon)
    .returning('category_pantheon_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

function update(changes, id) {
  return db('category_to_pantheons')
    .where('category_pantheon_id', id)
    .update(changes);
}

function remove(id) {
  return db('category_to_pantheons')
    .where( 'category_pantheon_id', id )
    .del();
}
