
exports.up = function(knex, Promise) {
    return knex.schema
      .table('users', function (table) {
        table.string('forgotten_password_reset_time')

      })
  
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema
      .table('users', function (table) {
        table.dropColumn('forgotten_password_reset_time');
      })
  
  };