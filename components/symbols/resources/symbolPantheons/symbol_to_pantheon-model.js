const db = require('../../../../data/dbConfig.js');

module.exports = {
  findBySymbol,
  findById,
  add,
  update,
  remove
};




function findBySymbol(id) {
  return db('symbol_to_pantheons')
  .leftJoin('pantheons', 'symbol_to_pantheons.sp_pantheon_id', 'pantheons.pantheon_id')
  .select('symbol_pantheon_id', 'pantheon_id', 'sp_description', 'pantheon_name', 'pantheon_description')
  .where('sp_symbol_id', id)
}

function findById(id) {
  return db('symbol_to_pantheons')
    .where( 'symbol_pantheon_id', id )
    .first();
}

function add(symbol_to_pantheon) {
  return db('symbol_to_pantheons')
    .insert(symbol_to_pantheon)
    .returning('symbol_pantheon_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

function update(changes, id) {
  return db('symbol_to_pantheons')
    .where('symbol_pantheon_id', id)
    .update(changes);
}

function remove(id) {
  return db('symbol_to_pantheons')
    .where( 'symbol_pantheon_id', id )
    .del();
}
