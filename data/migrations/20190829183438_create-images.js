exports.up = function(knex, Promise) {
  //Store the foreign key and foreign class name and always query by both
  //Boolean thumbnail for querying the "choosen" pic. Should only ever be one.
  return knex.schema
    .createTable('images', tbl => {
      tbl.increments('image_id');
      tbl.integer('foreign_id');
      tbl.text('foreign_class', 128);
      tbl.text('image_url');
      tbl.text('image_kind');
      tbl.text('image_title', 128);
      tbl.text('image_description');
      tbl.text('image_source');
    })

};

exports.down = function(knex, Promise) {
  // drops the entire table
  return knex.schema
    .dropTableIfExists('images');
};
