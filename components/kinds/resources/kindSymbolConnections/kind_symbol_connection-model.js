const db = require('../../../../data/dbConfig.js');

module.exports = {
  findByKind,
  findById,
  add,
  update,
  remove
};




function findByKind(id) {
  return db('kind_symbol_connections')
  .leftJoin('symbols', 'kind_symbol_connections.ksc_symbol_id', 'symbols.symbol_id')
  .leftJoin('kinds', 'symbols.symbol_kind_id', 'kinds.kind_id')
  .select('kind_symbol_connection_id', 'ksc_symbol_id', 
    'symbol_id',  'symbol_name', 
    'kind_id AS connected_symbol_kind_id', 'kind_name AS connected_symbol_kind_name')
  .where('ksc_kind_id', id)
}

function findById(id) {
  return db('kind_symbol_connections')
    .where( 'kind_symbol_connection_id', id )
    .first();
}

function add(kind_to_pantheon) {
  return db('kind_symbol_connections')
    .insert(kind_to_pantheon)
    .returning('kind_symbol_connection_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

function update(changes, id) {
  return db('kind_symbol_connections')
    .where('kind_symbol_connection_id', id)
    .update(changes);
}

function remove(id) {
  return db('kind_symbol_connections')
    .where( 'kind_symbol_connection_id', id )
    .del();
}
