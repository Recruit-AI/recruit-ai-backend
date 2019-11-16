const db = require('../../../../data/dbConfig.js');

module.exports = {
  findByKind,
  findById,
  add,
  update,
  remove
};




async function findByKind(id) {
  const kinds = await db('kind_info_kinds')
  .leftJoin('kinds', 'kind_info_kinds.kik_connected_info_id', 'kinds.kind_id')
  .select('kind_info_kind_id', 'kind_id', 'kik_connected_info_id', 'kind_name', 'kind_description')
  .where('kik_kind_id', id)

  let results = async() => Promise.all(kinds.map(item => {
    const symbols = db('symbols')
      .select('symbol_id', 'symbol_name')
      .where('symbol_kind_id', item.kind_id)
    return symbols.then(res =>  res.map( resItem => ({ kind_name: item.kind_name, ...resItem}) ))
   
  }))

  results = await results()
  return results
}

function findById(id) {
  return db('kind_info_kinds')
    .where( 'kind_info_kind_id', id )
    .first();
}

function add(kind_info_kind) {
  return db('kind_info_kinds')
    .insert(kind_info_kind)
    .returning('kind_info_kind_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

function update(changes, id) {
  return db('kind_info_kinds')
    .where('kind_info_kind_id', id)
    .update(changes);
}

function remove(id) {
  return db('kind_info_kinds')
    .where( 'kind_info_kind_id', id )
    .del();
}
