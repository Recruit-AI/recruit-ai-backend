exports.up = function(knex, Promise) {
  // don't forget the return statement
  return knex.schema
    .table('logs', function (table) {
      table.integer('object_id');
    })

};

exports.down = function(knex, Promise) {
  // drops the entire tables and the two fields
  return knex.schema
    .table('logs', function (table) {
      table.dropColumn('object_id');
    })

};
