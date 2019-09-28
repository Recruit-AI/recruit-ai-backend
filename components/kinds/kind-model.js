const db = require('../../data/dbConfig.js');

module.exports = {
  find,
  listOfNames,
  findById,
  findPantheonsByKindId,
  getSymbols,
  getImages,
  getThumbnail,
  add,
  addPantheonConnection,
  editPantheonConnection,
  update,
  remove,
  removeKindPantheonConnection
};



function find(sort, sortdir, searchTerm) {
  return db('kinds')
  .orderBy(sort, sortdir)
  .where('kind_name', 'like', `%${searchTerm}%`)
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

function findPantheonsByKindId(id) {
  return db('kinds_to_pantheons')
    .join('pantheons', 'kp_pantheon_id', '=', 'pantheon_id')
    .where('kp_kind_id', id)
}

function getImages(id) {
  return db('images').where("foreign_id", id).where("foreign_class", "Kind").where("thumbnail", false)
}

function getThumbnail(id) {
  return db('images').where("foreign_id", id).where("foreign_class", "Kind").where("thumbnail", true).first()
}

function add(kind) {
  return db('kinds')
    .insert(kind)
}

function addPantheonConnection(kind) {
  return db('kinds_to_pantheons')
    .insert(kind)
}

function editPantheonConnection(changes, id) {
  return db('kinds_to_pantheons')
    .where('kinds_to_pantheons_id', id)
    .update(changes);
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

function removeKindPantheonConnection(kp_id) {
  return db('kinds_to_pantheons')
    .where( 'kinds_to_pantheons_id', kp_id )
    .del();
}
