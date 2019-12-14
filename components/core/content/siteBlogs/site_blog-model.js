const db = require('../../../../data/dbConfig.js');
const knex = require('knex')

module.exports = {
  find,
  listOfNames,
  findById,
  findByName,
  add,
  update,
  remove,
};



function find(sort, sortdir, searchTerm, category, tag) {
  let query = db('site_blogs')
    .orderBy(sort, sortdir)
    .select('site_blog_id',
      'author_id',
      'username AS author_username',
      'blog_title',
      'blog_tags',
      'blog_category')
    .leftJoin('users', 'site_blogs.author_id', 'users.user_id')
    .where('blog_title', 'iLIKE', `%${searchTerm}%`)
    .andWhere('blog_category', category)

    if(tag !== "") { query = query.where(db.raw(`'${tag}' = ANY(blog_tags)`)) }
    
    return query

}

function listOfNames() {
  return db('site_blogs')
    .select('blog_title', 'site_blog_id')
}

function findById(id) {
  return db('site_blogs')
    .where('site_blog_id', id)
    .first();
}

function findByName(name, excludingId = null) {
  if (excludingId) {
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
    .update(changes)
    .returning('site_blog_id')
    .then(res => {
      return findById(res[0])
    })
}

function remove(id) {
  return db('site_blogs')
    .where('site_blog_id', id)
    .del();
}
