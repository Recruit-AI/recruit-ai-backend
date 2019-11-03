exports.up = function(knex, Promise) {
  // don't forget the return statement
  return knex.schema
    .table('users', function (table) {
      table.string('ban_notes');
    })

};

exports.down = function(knex, Promise) {
  // drops the entire tables and the two fields
  return knex.schema
    .table('users', function (table) {
      table.dropColumn('ban_notes');
    })

};
