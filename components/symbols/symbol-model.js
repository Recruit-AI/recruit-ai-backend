const db = require('../../data/dbConfig.js');

module.exports = {
  find,
  listOfNames,
  findById,
  findByName,
  findKind,
  add,
  update,
  remove
};



function find(sort, sortdir, searchTerm) {
  return db('symbols')
  .orderBy(sort, sortdir)
  .leftJoin('images', 'symbols.symbol_id', 'images.foreign_id')
  .leftJoin('kinds', 'symbols.symbol_kind_id', 'kinds.kind_id')
  .where("symbol_name", 'iLIKE', `%${searchTerm}%`)
  .andWhere(function() {
    this.where(function() {
      this.where('foreign_class', "Symbol").andWhere('thumbnail', true)
    }).orWhere(function() {
      this.whereNull('foreign_class').whereNull('thumbnail')
    })
  })
  .then()
  .catch(err => console.log(err))
}

function listOfNames() {
  return db('symbols')
  .select('symbol_name', 'symbol_id')
}

function findByName(name, excludingId = null) {
  if(excludingId) {
    return db('symbols')
    .where('symbol_name', name)
    .whereNot('symbol_id', excludingId)
    .first()
  } else {
    return db('symbols')
    .where('symbol_name', name)
    .first()
  }
}

function findById(id) {
  return db('symbols')
    .where( 'symbol_id', id )
    .first();
}

function findKind(kind_id) {
  return db('kinds').where('kind_id', kind_id).first()
}

function add(symbol) {
  return db('symbols')
    .insert(symbol)
    .returning('symbol_id')
    .then(res => {
      return findById(res[0])
    })
}

function update(changes, id) {
  return db('symbols')
    .where('symbol_id', id)
    .update(changes);
}

function remove(id) {
  return db('symbols')
    .where( 'symbol_id', id )
    .del();
}
