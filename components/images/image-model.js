const db = require('../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  getImages,
  getThumbnail,
  add,
  update,
  remove,
  removeThumbnail
};



function find() {
  return db('images')
}

function findById(id) {
  return db('images')
    .where( 'image_id', id )
    .first();
}

function getImages(foreign_class, id) {
  return db('images').where("foreign_id", id).where("foreign_class", foreign_class).where("thumbnail", false)
}

function getThumbnail(foreign_class, id) {
  return db('images').where("foreign_id", id).where("foreign_class", foreign_class).where("thumbnail", true).first()
}

function add(image) {
  return db('images')
    .insert(image)
    .then(ids => {
      return "Success";
    });
}

function update(changes, id) {
  return db('images')
    .where('image_id', id)
    .update(changes);
}

function remove(id) {
  return db('images')
    .where( 'image_id', id )
    .del();
}

function removeThumbnail(imageData) {
  db('images')
    .where('foreign_class', imageData.foreign_class)
    .where('foreign_id', imageData.foreign_id)
    .where('thumbnail', true)
    .update({thumbnail: false})
    .then((res) => {return res})
}
