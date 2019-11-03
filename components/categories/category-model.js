const db = require('../../data/dbConfig.js');

module.exports = {
  find,
  listOfNames,
  findById,
  add,
  update,
  remove,
};

function find(sort, sortdir, searchTerm) {
  return db('categories')
  .orderBy(sort, sortdir)
  .leftJoin('images', 'categories.category_id', 'images.foreign_id')
  .where('category_name', 'like', `%${searchTerm}%`)
  .andWhere(function() {
    this.where(function() {
      this.where('foreign_class', "Category").andWhere('thumbnail', true)
    }).orWhere(function() {
      this.whereNull('foreign_class').whereNull('thumbnail')
    })
  })
}

function listOfNames() {
  return db('categories')
  .select('category_name', 'category_id')
}

function findById(id) {
  return db('categories')
    .where( 'category_id', id )
    .first();
}

function add(category) {
  return db('categories')
    .insert(category)
    .returning('category_id')
    .then(res => {
      return findById(res[0])
    })
}

function update(changes, id) {
  return db('categories')
    .where('category_id', id)
    .update(changes);
}

function remove(id) {
  return db('categories')
    .where( 'category_id', id )
    .del();
}
