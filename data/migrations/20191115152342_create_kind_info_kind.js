//Add ability to show select connections on kind page
exports.up = function(knex, Promise) {
    return knex.schema
    .createTable('kind_info_kinds', tbl => {
        tbl.increments('kind_info_kind_id');
        tbl.integer('kik_kind_id')
        .unsigned()
        .notNullable()
        .references('kind_id')
        .inTable('kinds')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
        tbl.integer('kik_connected_info_id')
        .unsigned()
        .notNullable()
        .references('kind_id')
        .inTable('kinds')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('kind_info_kinds');
};

