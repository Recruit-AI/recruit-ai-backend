
exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('alerts', tbl => {
            tbl.increments('alert_id');
            tbl.text('alert_state');
            tbl.text('alert_type');
            tbl.datetime('alert_time', { precision: 6 }).defaultTo(knex.fn.now(6))

            tbl.integer('alert_athlete_id')
                .unsigned()
                .references('athlete_id')
                .inTable('athletes')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');

            tbl.integer('alert_personnel_id')
                .unsigned()
                .notNullable()
                .references('user_id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');

        })

};

exports.down = function (knex, Promise) {
    // drops the entire table
    return knex.schema
        .dropTableIfExists('alerts')
};

