//Add ability to show select connections on kind page
exports.up = function(knex, Promise) {
    return knex.schema
    .createTable('symbol_resources', tbl => {
        tbl.increments('symbol_resource_id');
        tbl.text('sr_description')
        tbl.integer('sr_symbol_id')
        .unsigned()
        .notNullable()
        .references('symbol_id')
        .inTable('symbols')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
        tbl.integer('sr_resource_id')
        .unsigned()
        .notNullable()
        .references('resource_id')
        .inTable('resources')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists("symbol_resources");
};

