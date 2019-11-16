exports.up = function(knex, Promise) {
    return knex.schema
      .createTable('ip_logs', tbl => {
        tbl.increments('ip_log_id');
        tbl.text('ip_address').notNullable();
      })
  
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema
      .dropTableIfExists('ip_logs');
  };
  