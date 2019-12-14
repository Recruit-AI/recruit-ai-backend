exports.up = function(knex, Promise) {
    // don't forget the return statement
    return knex.schema
      .createTable('support_tickets', tbl => {
        tbl.increments('support_ticket_id');
        tbl.integer('support_ticket_kind').notNullable();
        tbl.text('support_ticket_message').notNullable();
        tbl.text('support_ticket_name')
        tbl.text('support_ticket_email')
        //whether or not the user wishes to be kept updated
        tbl.boolean('require_update').defaultTo(true)
        //Status updates regarding this
        tbl.text('support_ticket_state').defaultTo("pending")
        //Public & private notes- one is seen on the status page, one is only visible by admins
        tbl.text('public_notes_text')
        tbl.text('private_notes_text')
      })
  
  };
  
  exports.down = function(knex, Promise) {
    // drops the entire table
    return knex.schema
      .dropTableIfExists('support_tickets');
  };
  