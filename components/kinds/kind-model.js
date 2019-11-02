const db = require('../../data/dbConfig.js');

module.exports = {
  find,
  listOfNames,
  findById,
  getSymbols,
  add,
  update,
  remove
};



function find(sort, sortdir, searchTerm) {
  return db('kinds')
  .orderBy(sort, sortdir)
  .leftJoin('images', 'kinds.kind_id', 'images.foreign_id')
  .where('kind_name', 'like', `%${searchTerm}%`)
  .andWhere(function() {
    this.where(function() {
      this.where('foreign_class', "Kind").andWhere('thumbnail', true)
    }).orWhere(function() {
      this.whereNull('foreign_class').whereNull('thumbnail')
    })
  })
}

function listOfNames() {
  return db('kinds')
  .select('kind_name', 'kind_id')
}

function findById(id) {
  return db('kinds')
    .join('pantheons', 'pantheon_id', '=', 'creator_pantheon_id')
    .where( 'kind_id', id )
    .first();
}

function getSymbols(id) {
  return db('symbols').where('symbol_kind_id', id)
}

function add(kind) {
  return db('kinds')
    .insert(kind)
    .returning('kind_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

function update(changes, id) {
  return db('kinds')
    .where('kind_id', id)
    .update(changes);
}

function remove(id) {
  return db('kinds')
    .where( 'kind_id', id )
    .del();
}
