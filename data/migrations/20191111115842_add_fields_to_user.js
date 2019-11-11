exports.up = function(knex, Promise) {
  // don't forget the return statement
  return knex.schema
    .table('users', function (table) {
      table.datetime('last_login_attempt');
      table.integer('login_attempts');
      table.boolean('mailing_list');

    })

};

exports.down = function(knex, Promise) {
  // drops the entire tables and the two fields
  return knex.schema
    .table('users', function (table) {
      table.dropColumn('last_login_attempt');
      table.dropColumn('login_attempts');
      table.dropColumn('mailing_list');
    })

};
