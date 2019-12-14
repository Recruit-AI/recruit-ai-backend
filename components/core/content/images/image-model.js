const db = require('../../../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  getImages,
  getGallery,
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

function images(foreign_class, id) {
  return db('images')
  .select('image_id', 'image_title', 'image_url', 'image_description', 'image_source')
  .where("foreign_id", id)
  .where("foreign_class", foreign_class)
}

function getImages(foreign_class, id) {
  return images(foreign_class, id)
  .whereNot('image_kind', "thumbnail")
  .whereNot('image_kind', "gallery")
}

function getGallery(foreign_class, id) {
  return images(foreign_class, id)
  .where('image_kind', 'gallery')
}

function getThumbnail(foreign_class, id) {
  return images(foreign_class, id)
  .where('image_kind', 'thumbnail')
  .first() 
}

function add(image) {
  return db('images')
    .insert(image)
    .returning('image_id')
    .then(res => {
      return findById(res[0])
    })
}

function update(changes, id) {
  return db('images')
    .where('image_id', id)
    .update(changes)
    .returning('image_id')
    .then(res => {
      return findById(res[0])
    });
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
