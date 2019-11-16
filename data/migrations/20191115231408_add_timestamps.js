exports.up = function(knex, Promise) {
    // don't forget the return statement
    return knex.schema
      .table('ip_logs', function (table) {
        table.timestamps(false, true)
      })
  
  };
  
  exports.down = function(knex, Promise) {
    // drops the entire tables and the two fields
    return knex.schema
      .table('ip_logs', function (table) {
        table.dropTimestamps();
      })
  
  };