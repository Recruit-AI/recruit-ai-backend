const db = require('../../../../../data/dbConfig.js');


const database = (kind) => {
  const idStr = `${kind}_id`
  const tableName = kind + "s"

  function findById(id) {
    return db(tableName)
      .where(idStr, id)
      .first();
  }

  function findByUserId(id) {
    return db(tableName)
      .where('foreign_user_id', id)
      .first();
  }

  function add(user_info) {
    return db(tableName)
      .insert(user_info)
      .returning(idStr)
      .then(res => {
        return findById(res[0])
      })
      .catch(err => {
        console.log(err)
        return err
      })
  }

  function update(changes, id) {
    return db(tableName)
      .where(idStr, id)
      .update(changes)
      .returning(idStr)
      .then(res => {
        return findById(res[0])
      })
      .catch(err => {
        console.log(err)
        return err
      })
  }

  function updateByUserId(changes, id) {
    return db(tableName)
      .where('foreign_user_id', id)
      .update(changes)
      .returning(idStr)
      .then(res => {
        return findById(res[0])
      })
      .catch(err => {
        console.log(err)
        return err
      })
  }

  function remove(id) {
    return db(tableName)
      .where(idStr, id)
      .del();
  }

  return {findByUserId, updateByUserId, add, update, remove}

}


module.exports = database;