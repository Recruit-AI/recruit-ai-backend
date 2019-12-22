
exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('messages', tbl => {
            tbl.increments('message_id');
            tbl.text('message_type');
            tbl.text('message_text');

            tbl.integer('message_athlete_id')
                .unsigned()
                .notNullable()
                .references('athlete_id')
                .inTable('athletes')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');

            tbl.integer('message_personnel_id')
                .unsigned()
                .notNullable()
                .references('user_id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');

            tbl.integer('message_team_id')
                .unsigned()
                .notNullable()
                .references('team_id')
                .inTable('teams')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');


        })

};

exports.down = function (knex, Promise) {
    // drops the entire table
    return knex.schema
        .dropTableIfExists('messages')
};

