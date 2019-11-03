exports.up = function(knex, Promise) {
  // don't forget the return statement
  return knex.schema
    .createTable('logs', tbl => {
      tbl.increments('log_id');
      tbl.integer('log_submitting_user_id')
        .unsigned()
        .references('user_id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.integer('log_confirming_user_id')
        .unsigned()
        .references('user_id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.text('route').notNullable();
      tbl.text('method').notNullable();
      tbl.json('changes')
      tbl.json('previous')
      tbl.text('notes')
      tbl.boolean('log_confirmed')
    })

};

exports.down = function(knex, Promise) {
  // drops the entire table
  return knex.schema
    .dropTableIfExists('logs');
};
