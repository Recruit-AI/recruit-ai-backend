const db = require('../../../../data/dbConfig.js');

module.exports = {
  findBySymbol,
  findById,
  add,
  update,
  remove
};

function findBySymbol(id) {
  return db('symbol_resources')
  .leftJoin('resources', 'symbol_resources.sr_symbol_id', 'resources.resource_id')
  .select(
    'symbol_resource_id',
    'sr_resource_id',
    'sr_description',
    'resource_id',
    'resource_link',
    'resource_type',
    'resource_title',
    'resource_description'
  )
  .where('sr_symbol_id', id)
}

function findById(id) {
  return db('symbol_resources')
    .where( 'symbol_resource_id', id )
    .first();
}

function add(symbol_resource) {
  return db('symbol_resources')
    .insert(symbol_resource)
    .returning('symbol_resource_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

function update(changes, id) {
  return db('symbol_resources')
    .where('symbol_resource_id', id)
    .update(changes);
}

function remove(id) {
  return db('symbol_resources')
    .where( 'symbol_resource_id', id )
    .del();
}
