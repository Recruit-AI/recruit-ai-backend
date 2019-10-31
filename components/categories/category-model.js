const db = require('../../data/dbConfig.js');

module.exports = {
  find,
  listOfNames,
  findById,
  findKindsByCategoryId,
  findPrereqsByCategoryId,
  getImages,
  getThumbnail,
  add,
  addKindsConnection,
  addPrereq,
  editKindsConnection,
  editPrereq,
  update,
  remove,
  removeKindsConnection,
  removePrereq
};



function find(sort, sortdir, searchTerm) {
  return db('categories')
  .orderBy(sort, sortdir)
  .where('category_name', 'like', `%${searchTerm}%`)
}

function listOfNames() {
  return db('categories')
  .select('category_name', 'category_id')
}

function findById(id) {
  return db('categories')
    .where( 'category_id', id )
    .first();
}

function findKindsByCategoryId(id) {
  return db('category_to_kinds')
    .join('kinds', 'category_to_kinds.ck_kind_id', 'kinds.kind_id')
    .where('ck_category_id', id)
}

function findPrereqsByCategoryId(id) {
  return db('category_prerequisites')
    .join('categories', 'category_prerequisites.cp_prereq_id', 'categories.category_id')
    .where('cp_category_id', id)
}

function getImages(id) {
  return db('images').where("foreign_id", id).where("foreign_class", "Category").where("thumbnail", false)
}

function getThumbnail(id) {
  return db('images').where("foreign_id", id).where("foreign_class", "Category").where("thumbnail", true).first()
}

function add(category) {
  return db('categories')
    .insert(category)
    .returning('category_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

function addKindsConnection(category_kind) {
  return db('category_to_kinds')
    .insert(category_kind)
    .then(ids => {
      return "Success";
    });
}

function addPrereq(prereq) {
  return db('category_prerequisites')
    .insert(prereq)
    .then(ids => {
      return "Success";
    });
}

function editKindsConnection(data, id) {
  return db('category_to_kinds')
    .where('category_kind_id', id)
    .update(data);
}

function editPrereq(data, id) {
  return db('category_prerequisites')
    .where('category_prereq_id', id)
    .update(data);
}

function update(changes, id) {
  return db('categories')
    .where('category_id', id)
    .update(changes);
}

function remove(id) {
  return db('categories')
    .where( 'category_id', id )
    .del();
}

function removeKindsConnection(ck_id) {
  return db('category_to_kinds')
    .where( 'category_kind_id', ck_id )
    .del();
}

function removePrereq(prereq_id) {
  return db('category_prerequisites')
    .where('category_prereq_id', prereq_id )
    .del();
}
