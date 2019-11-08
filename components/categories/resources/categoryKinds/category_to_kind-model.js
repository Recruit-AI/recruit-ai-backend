const db = require('../../../../data/dbConfig.js');

module.exports = {
  findByCategory,
  findById,
  add,
  update,
  remove
};



function findByCategory(id) {
  return db('category_to_kinds')
  .leftJoin('kinds', 'category_to_kinds.ck_kind_id', 'kinds.kind_id')
  .select('category_kind_id', 'kind_id', 'ck_description', 'kind_name', 'kind_description')
  .where('ck_category_id', id)
}

function findById(id) {
  return db('category_to_kinds')
    .where( 'category_kind_id', id )
    .first();
}

function add(category_to_kind) {
  return db('category_to_kinds')
    .insert(category_to_kind)
    .returning('category_kind_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

function update(changes, id) {
  return db('category_to_kinds')
    .where('category_kind_id', id)
    .update(changes);
}

function remove(id) {
  return db('category_to_kinds')
    .where( 'category_kind_id', id )
    .del();
}
