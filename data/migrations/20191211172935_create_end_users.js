exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('end_users', tbl => {
            tbl.increments('end_user_id');
            tbl.integer('foreign_user_id')
                .unsigned()
                .notNullable()
                .references('user_id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            tbl.text('user_full_name');
            tbl.text('user_bio');
            tbl.text('user_link', 128);
            tbl.text('user_link_description');
        })

};

exports.down = function(knex, Promise) {
    // drops the entire table
    return knex.schema
      .dropTableIfExists('end_users')
  };
  
