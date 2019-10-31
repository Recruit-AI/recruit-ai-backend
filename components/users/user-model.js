const db = require('../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  findByUsername,
  getImages,
  getThumbnail,
  add,
  update,
  remove
};



function find() {
  return db('users')
}

function findById(id) {
  return db('users')
    .where( 'user_id', id )
    .first();
}

function findByUsername(username) {
  return db('users')
    .where({ username })
    .first();
}

function getImages(id) {
  return db('images').where("foreign_id", id).where("foreign_class", "User").where("thumbnail", false)
}

function getThumbnail(id) {
  return db('images').where("foreign_id", id).where("foreign_class", "User").where("thumbnail", true).first()
}

function add(user) {
  return db('users')
    .insert(user)
    .then(ids => {
      return "Success";
    });
}

function update(changes, id) {
  return db('users')
    .where('user_id', id)
    .update(changes);
}

function remove(id) {
  return db('users')
    .where( 'user_id', id )
    .del();
}
