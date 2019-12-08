exports.up = function(knex, Promise) {
    // don't forget the return statement
    return knex.schema
      .table('pantheons_history', function (table) {
        table.string('history_type')
      })
  
  };
  
  exports.down = function(knex, Promise) {
    // drops the entire tables and the two fields
    return knex.schema
      .table('pantheons_history', function (table) {
        table.dropColumn('history_type');
      })
  
  };