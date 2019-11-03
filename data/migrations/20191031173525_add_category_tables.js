exports.up = function(knex, Promise) {
  // don't forget the return statement
  return knex.schema
    .createTable('category_to_symbols', tbl => {
      tbl.increments('category_symbol_id');
      tbl.integer('cs_category_id')
        .unsigned()
        .references('category_id')
        .inTable('categories')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.integer('cs_symbol_id')
        .unsigned()
        .references('symbol_id')
        .inTable('symbols')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.text('cs_description')
  })
  .createTable('category_to_pantheons', tbl => {
    tbl.increments('category_pantheon_id');
      tbl.integer('cpa_category_id')
        .unsigned()
        .references('category_id')
        .inTable('categories')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      tbl.integer('cpa_pantheon_id')
        .unsigned()
        .references('pantheon_id')
        .inTable('pantheons')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.text('cpa_description')
  })
  .table('category_prerequisites', function (table) {
    table.string('cp_description');
  })
  .table('category_to_kinds', function (table) {
    table.string('ck_description');
  })

};

exports.down = function(knex, Promise) {
  // drops the entire tables and the two fields
  return knex.schema
    .dropTableIfExists('category_to_pantheons')
    .dropTableIfExists('category_to_symbols')
    .table('category_prerequisites', function (table) {
      table.dropColumn('cp_description');
    })
    .table('category_to_kinds', function (table) {
      table.dropColumn('ck_description');
    })

};
