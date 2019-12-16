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
            tbl.integer('team_id')
                .unsigned()
                .references('user_id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            tbl.boolean('team_verified')
            tbl.text('user_first_name');
            tbl.text('user_last_name');
            tbl.text('user_professional_title');
            tbl.text('user_display_name');
            tbl.specificType('athlete_watch_list', 'text ARRAY');
            tbl.integer('alert_settings')
        })

};

exports.down = function (knex, Promise) {
    // drops the entire table
    return knex.schema
        .dropTableIfExists('end_users')
};

