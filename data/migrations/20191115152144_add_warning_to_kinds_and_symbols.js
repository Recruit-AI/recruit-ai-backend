exports.up = function(knex, Promise) {
    // don't forget the return statement
    return knex.schema
      .table('kinds', function (table) {
        table.string('health_warning');
      })
      .table('symbols', function (table) {
        table.string('health_warning');
      })
  
  };
  
  exports.down = function(knex, Promise) {
    // drops the entire tables and the two fields
    return knex.schema
      .table('kinds', function (table) {
        table.dropColumn('health_warning');
      })
      .table('symbols', function (table) {
        table.dropColumn('health_warning');
      })
  
  };