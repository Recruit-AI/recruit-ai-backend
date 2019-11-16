exports.up = function(knex, Promise) {
    return knex.schema
      .createTable('ip_bans', tbl => {
        tbl.increments('ip_ban_id');
        tbl.text('ip_address').notNullable();
      })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema
      .dropTableIfExists('ip_bans');
  };
  