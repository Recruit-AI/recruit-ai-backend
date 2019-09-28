const db = require('../../data/dbConfig.js');

module.exports = {
  find,
  listOfNames,
  findById,
  findByHistoryId,
  historyById,
  influencedById,
  getCreatedKinds,
  getUsesKinds,
  getImages,
  getThumbnail,
  add,
  addHistory,
  editHistory,
  update,
  remove,
  removeHistoriesById,
  removeHistory
};



function find(sort, sortdir, searchTerm) {
  return db('pantheons')
  .orderBy(sort, sortdir)
  .join('images', 'pantheons.pantheon_id', 'images.foreign_id')
  .where('foreign_class', "Pantheon")
  .where('pantheon_name', 'like', `%${searchTerm}%`)
  .where('thumbnail', 1)
}

function listOfNames() {
  return db('pantheons')
  .select('pantheon_name', 'pantheon_id')
}

function findById(id) {
  return db('pantheons')
    .where( 'pantheon_id', id )
    .first();
}

function findByHistoryId(id) {
  return db('pantheons_history')
    .where( 'pantheon_history_id', id )
    .first();
}

//Returns an array of simple pantheon objects based on the provided id. Only returns short fields, no longtext fields.
function historyById(id) {
  return db('pantheons_history')
  .select('pantheon_history_id', 'influenced_id', 'influencer_id', 'pantheon_id', 'pantheon_name', 'pantheon_description', 'start_year', 'end_year')
  .join('pantheons', 'pantheons_history.influencer_id', 'pantheons.pantheon_id')
  .where('influenced_id', id)
}

//Returns an array of simple pantheon objects based on the provided id. Only returns short fields, no longtext fields.
function influencedById(id) {
  return db('pantheons_history')
  .select('pantheon_history_id', 'influenced_id', 'influencer_id', 'pantheon_id', 'pantheon_name', 'pantheon_description', 'start_year', 'end_year')
  .join('pantheons', 'pantheons_history.influenced_id', 'pantheons.pantheon_id')
  .where('influencer_id', id)
}

function getCreatedKinds(id) {
  return db('kinds')
  .where('creator_pantheon_id', id)
}

function getUsesKinds(id) {
  return db('kinds_to_pantheons')
  .join('kinds', 'kinds_to_pantheons.kp_kind_id', 'kinds.kind_id')
  .where('kp_pantheon_id', id)
}

function getImages(id) {
  return db('images').where("foreign_id", id).where("foreign_class", "Pantheon").where("thumbnail", false)
}

function getThumbnail(id) {
  return db('images').where("foreign_id", id).where("foreign_class", "Pantheon").where("thumbnail", true).first()
}

function add(pantheon) {
  return db('pantheons')
    .insert(pantheon)
    .then(ids => {
      return findById(ids[0]);
    });
}

function addHistory(data) {
    return db('pantheons_history')
    .insert(data)
    .then(ids => {
      return ids[0]
    });
}

function editHistory(data, id) {
   return db('pantheons_history').where('pantheon_history_id', id).update(data);
}

function update(changes, id) {
  return db('pantheons')
    .where('pantheon_id', id)
    .update(changes);
}

function remove(id) {
  return db('pantheons')
    .where( 'pantheon_id', id )
    .del();
}

function removeHistoriesById(id){
  return db('pantheons_history')
    .where('influenced_id', id)
    .orWhere('influencer_id', id)
    .del();
}

function removeHistory(id){
  return db('pantheons_history')
    .where('pantheon_history_id', id)
    .del();
}
