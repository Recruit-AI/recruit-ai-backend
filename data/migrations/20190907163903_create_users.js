exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', tbl => {
      tbl.increments('user_id');
      tbl.text('password', 128).notNullable();
      tbl.text('username', 32).notNullable().unique();
      tbl.text('user_email', 128).notNullable().unique();

      tbl.text('user_full_name');
      tbl.text('user_bio');
      tbl.text('user_link', 128);
      tbl.text('user_link_description');
      
      tbl.integer('user_role');
      tbl.integer('user_kind');

      tbl.boolean('user_verified');
      tbl.string('ban_notes');
      tbl.datetime('last_login_attempt');
      tbl.integer('login_attempts');
      tbl.boolean('mailing_list');
      tbl.string('forgotten_password_reset_time')
    })

};

exports.down = function(knex, Promise) {
  // drops the entire table
  return knex.schema
    .dropTableIfExists('users')
};
