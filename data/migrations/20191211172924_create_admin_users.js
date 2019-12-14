exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('admin_users', tbl => {
            tbl.increments('admin_user_id');
            tbl.integer('foreign_user_id')
                .unsigned()
                .notNullable()
                .references('user_id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            tbl.text('phone-number')
            tbl.text('public-email')
        })

};

exports.down = function (knex, Promise) {
    // drops the entire table
    return knex.schema
        .dropTableIfExists('admin_users');
};
