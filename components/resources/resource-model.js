const db = require('../../data/dbConfig.js');
const knex = require('knex')

module.exports = {
  find,
  findById,
  listOfNames,
  add,
  update,
  remove
};


function find(tag, sortdir, searchTerm, type) {
  if(tag) {
    return db('resources')
    .orderBy('resource_title', sortdir)
    .where(knex.raw(`'${tag}' = ANY(resource_tags)`))
    .andWhere('resource_title', 'iLIKE', `%${searchTerm}%`)
    .andWhere('resource_type', 'LIKE', type ? `${type}` : "%")

  } else {
    return db('resources')
    .orderBy('resource_title', sortdir)
    .where('resource_title', 'iLIKE', `%${searchTerm}%`)
    .andWhere('resource_type', 'LIKE', type ? `${type}` : "%")
  }
}

function findById(id) {
  return db('resources')
    .where( 'resource_id', id )
    .first();
}

function listOfNames() {
  return db('resources')
  .select('resource_name', 'resource_id')
}

function add(resource) {
  return db('resources')
    .insert(resource)
    .returning('resource_id')
    .then(res => {
      return findById(res[0])
    })
}

function update(changes, id) {
  return db('resources')
    .where('resource_id', id)
    .update(changes)
    .returning('resource_id')
    .then(res => {
      return findById(res[0])
    })
}

function remove(id) {
  return db('resources')
    .where( 'resource_id', id )
    .del();
}
