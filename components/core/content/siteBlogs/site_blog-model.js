const db = require('../../../../data/dbConfig.js');

module.exports = {
  find,
  listOfNames,
  findById,
  findByName,
  add,
  update,
  remove,
};



function find(sort, sortdir, searchTerm) {
  return db('site_blogs')
  .orderBy(sort, sortdir)
  .where('blog_title', 'iLIKE', `%${searchTerm}%`)
  
  .then()
  .catch(err => console.log(err))

}

function listOfNames() {
  return db('site_blogs')
  .select('blog_title', 'site_blog_id')
}

function findById(id) {
  return db('site_blogs')
    .where( 'site_blog_id', id )
    .first();
}

function findByName(name, excludingId = null) {
  if(excludingId) {
    return db('site_blogs')
    .where('blog_title', name)
    .whereNot('site_blog_id', excludingId)
    .first()
  } else {
    return db('site_blogs')
    .where('blog_title', name)
    .first()
  }
}

function add(site_blog) {
  return db('site_blogs')
    .insert(site_blog)
    .returning('site_blog_id')
    .then(res => {
      return findById(res[0])
    })
}

function update(changes, id) {
  return db('site_blogs')
    .where('site_blog_id', id)
    .update(changes);
}

function remove(id) {
  return db('site_blogs')
    .where( 'site_blog_id', id )
    .del();
}
