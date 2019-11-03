exports.up = function(knex, Promise) {
  // don't forget the return statement
  return knex.schema
    .table('symbol_to_pantheons', function (table) {
      table.string('sp_description');
    })

};

exports.down = function(knex, Promise) {
  // drops the entire tables and the two fields
  return knex.schema
    .table('symbol_to_pantheons', function (table) {
      table.dropColumn('sp_description');
    })

};
