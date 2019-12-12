const db = require('../../data/dbConfig.js');

module.exports = {
  find,
  findById,
  add,
  update,
  remove
};


function find(filter) {
  let query = db('support_tickets')
  if(filter != "") {
    query = query.where('support_ticket_state', filter)
  } 
  return query
}


function findById(id) {
  return db('support_tickets')
    .where( 'support_ticket_id', id )
    .first();
}

function add(support_ticket) {
  return db('support_tickets')
    .insert(support_ticket)
    .returning('support_ticket_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

function update(changes, id) {
  return db('support_tickets')
    .where('support_ticket_id', id)
    .update(changes)
    .returning('support_ticket_id')
    .then(res => {
      return findById(res[0])
    })
    .catch(err => {
      console.log(err)
      return err
    });
}

function remove(id) {
  return db('support_tickets')
    .where( 'support_ticket_id', id )
    .del();
}
