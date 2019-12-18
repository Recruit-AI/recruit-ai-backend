
exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('visits', tbl => {
            tbl.increments('visit_id');
            tbl.integer('visit_team_id')
                .unsigned()
                .notNullable()
                .references('team_id')
                .inTable('teams')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            tbl.integer('visit_athlete_id')
                .unsigned()
                .notNullable()
                .references('athlete_id')
                .inTable('athletes')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            tbl.integer('visit_personnel_id')
                .unsigned()
                .notNullable()
                .references('user_id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            tbl.text('visit_status');
            tbl.text('reporting_address');
            tbl.text('reporting_instructions');
            tbl.specificType('time_options', 'text ARRAY');
            tbl.datetime('chosen_time', { precision: 6 });
        })

};

exports.down = function (knex, Promise) {
    // drops the entire table
    return knex.schema
        .dropTableIfExists('visits')
};

