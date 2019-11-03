exports.up = function(knex, Promise) {
  // don't forget the return statement
  return knex.schema
    .createTable('sources', tbl => {
      tbl.increments('source_id');
      tbl.integer('foreign_key').notNullable();
      tbl.text('foreign_class').notNullable();
      tbl.text('source_link').notNullable();
      tbl.text('source_title').notNullable();
      tbl.text('source_article_title')
      tbl.text('source_description')
    })

};

exports.down = function(knex, Promise) {
  // drops the entire table
  return knex.schema
    .dropTableIfExists('sources');
};
