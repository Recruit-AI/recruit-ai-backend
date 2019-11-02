exports.up = function(knex, Promise) {
  // don't forget the return statement
  return knex.schema
    .table('kinds_to_pantheons', function (table) {
      table.string('kp_description');
    })

};

exports.down = function(knex, Promise) {
  // drops the entire tables and the two fields
  return knex.schema
    .table('kinds_to_pantheons', function (table) {
      table.dropColumn('kp_description');
    })

};
