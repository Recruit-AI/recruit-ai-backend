const db = require('../../../../data/dbConfig.js');

module.exports = {
  find,
  findUser,
  findById,
  findByEmail,
  findByUsername,
  getImages,
  getThumbnail,
  add,
  update,
  remove,
  verify,
  updatePassword
};



function find(username) {
  return db('users')
    .where('username', 'iLIKE', `%${username}%`)
}

function findById(id) {
  return db('users')
    .where('user_id', id)
    .first();
}
function findUser(email, username = null) {
  return db('users')
    .where('user_email', 'iLIKE', email)
    .orWhere('username', 'iLIKE', username || email)
    .first();
}

function findByUsername(username) {
  return db('users')
    .where('username', 'iLIKE', '%'+username+'%')
    .first();
}

function findByEmail(user_email) {
  return db('users')
  .where('user_email', 'iLIKE', '%'+email+'%')
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
    .returning('user_id')
    .then(res => {
      return findById(res[0])
    })
}

function update(changes, id) {
  return db('users')
    .where('user_id', id)
    .update(changes)
    .returning('user_id')
    .then(res => {
      return findById(res[0])
    });
}

function remove(id) {
  return db('users')
    .where('user_id', id)
    .del();
}

function verify(id) {
  return update({ user_verified: true }, id)
}

function updatePassword(hash, id) {
  return update({
    password: hash,
    forgotten_password_reset_time: null
  }, id)
}