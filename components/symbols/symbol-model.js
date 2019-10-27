const db = require('../../data/dbConfig.js');

module.exports = {
  find,
  listOfNames,
  findById,
  findPantheonsBySymbolId,
  findConnectionsBySymbolId,
  findKind,
  getImages,
  getThumbnail,
  add,
  addPantheonsConnection,
  addConnection,
  editPantheonsConnection,
  editConnection,
  update,
  remove,
  removePantheonsConnection,
  removeConnection
};



function find(sort, sortdir, searchTerm) {
  return db('symbols')
  .orderBy(sort, sortdir)
  .leftJoin('images', 'symbols.symbol_id', 'images.foreign_id')
  .leftJoin('kinds', 'symbols.symbol_kind_id', 'kinds.kind_id')
  .where('symbol_name', 'like', `%${searchTerm}%`)
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

function findById(id) {
  return db('symbols')
    .where( 'symbol_id', id )
    .first();
}

function findPantheonsBySymbolId(id) {
  return db('symbol_to_pantheons')
    .join('pantheons', 'symbol_to_pantheons.sp_pantheon_id', 'pantheons.pantheon_id')
    .where('sp_symbol_id', id)
}

function findConnectionsBySymbolId(id) {
  return db('symbol_connections')
    .join('symbols', 'symbol_connections.connected_symbol_id', 'symbols.symbol_id')
    .join('kinds', 'symbols.symbol_kind_id', 'kinds.kind_id')
    .where('main_symbol_id', id)
}

function findKind(kind_id) {
  return db('kinds').where('kind_id', kind_id).first()
}

function getImages(id) {
  return db('images').where("foreign_id", id).where("foreign_class", "Symbol").where("thumbnail", false)
}

function getThumbnail(id) {
  return db('images').where("foreign_id", id).where("foreign_class", "Symbol").where("thumbnail", true).first()
}

function add(symbol) {
  return db('symbols')
    .insert(symbol)
    .returning('symbol_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

function addPantheonsConnection(symbol_pantheon) {
  return db('symbol_to_pantheons')
    .insert(symbol_pantheon)
    .then(ids => {
      return "Success";
    });
}

function addConnection(connection) {
  return db('symbol_connections')
    .insert(connection)
    .then(ids => {
      return "Success";
    });
}

function editPantheonsConnection(symbol_pantheon, id) {
  return db('symbol_to_pantheons')
    .where('symbol_pantheon_id', id)
    .update(symbol_pantheon);
}

function editConnection(connection, id) {
  return db('symbol_connections')
    .where('symbol_connection_id', id)
    .update(connection);
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

function removePantheonsConnection(symbol_pantheon_id) {
  return db('symbol_to_pantheons')
    .where( 'symbol_pantheon_id', symbol_pantheon_id)
    .del();
}

function removeConnection(symbol_connection_id) {
  return db('symbol_connections')
    .where( 'symbol_connection_id', symbol_connection_id)
    .del();
}
