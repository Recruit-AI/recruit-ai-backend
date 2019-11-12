const db = require('../../../../data/dbConfig.js');

module.exports = {
  findByCategory,
  findAdvancedByCategory,
  findById,
  add,
  update,
  remove
};




function findByCategory(id) {
  return db('category_prerequisites')
  .leftJoin('categories', 'category_prerequisites.cp_prereq_id', 'categories.category_id')
  .select('category_prereq_id', 'cp_prereq_id', 'cp_description', 'category_id', 'category_name', 'category_description')
  .where('cp_category_id', id)
}

function findAdvancedByCategory(id) {
  return db('category_prerequisites')
  .leftJoin('categories', 'category_prerequisites.cp_category_id', 'categories.category_id')
  .select('category_prereq_id', 'cp_prereq_id', 'cp_description', 'category_name', 'category_description')
  .where('cp_prereq_id', id)
}

function findById(id) {
  return db('category_prerequisites')
    .where( 'category_prereq_id', id )
    .first();
}

function add(category_prerequisite) {
  return db('category_prerequisites')
    .insert(category_prerequisite)
    .returning('category_prereq_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

function update(changes, id) {
  return db('category_prerequisites')
    .where('category_prereq_id', id)
    .update(changes);
}

function remove(id) {
  return db('category_prerequisites')
    .where( 'category_prereq_id', id )
    .del();
}
