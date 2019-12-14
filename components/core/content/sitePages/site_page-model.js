const db = require('../../../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  findByName,
  add,
  update,
  remove,
};



function find() {
  return db('site_pages')

}

function findById(id) {
  return db('site_pages')
    .where( 'site_page_id', id )
    .first();
}

function findByName(name, excludingId = null) {
  if(excludingId) {
    return db('site_pages')
    .where('page_title', name)
    .whereNot('site_page_id', excludingId)
    .first()
  } else {
    return db('site_pages')
    .where('page_title', name)
    .first()
  }
}

function add(site_page) {
  return db('site_pages')
    .insert(site_page)
    .returning('site_page_id')
    .then(res => {
      return findById(res[0])
    })
}

function update(changes, id) {
  return db('site_pages')
    .where('site_page_id', id)
    .update(changes)
    .returning('site_page_id')
    .then(res => {
      return findById(res[0])
    })
}

function remove(id) {
  return db('site_pages')
    .where( 'site_page_id', id )
    .del();
}
