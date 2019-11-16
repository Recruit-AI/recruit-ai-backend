exports.up = function(knex, Promise) {
    return knex.schema
      .createTable('resources', tbl => {
        tbl.increments('resource_id');
        tbl.text('resource_link').notNullable();
        tbl.text('resource_type').notNullable();
        tbl.specificType('resource_tags', 'text ARRAY');
        tbl.text('resource_title').notNullable();
        tbl.text('resource_description');
      })
  
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema
      .dropTableIfExists('resources');
  };
  