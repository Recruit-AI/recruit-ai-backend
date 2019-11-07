exports.up = function(knex, Promise) {
  // don't forget the return statement
  return knex.schema
    .createTable('feedbacks', tbl => {
      tbl.increments('feedback_id');
      tbl.integer('feedback_kind').notNullable();
      tbl.text('feedback_message').notNullable();
      tbl.text('feedback_name')
      tbl.text('feedback_email')
      tbl.boolean('logged').defaultTo(false)
    })

};

exports.down = function(knex, Promise) {
  // drops the entire table
  return knex.schema
    .dropTableIfExists('feedbacks');
};
