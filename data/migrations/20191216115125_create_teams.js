exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('teams', tbl => {
            tbl.increments('team_id');
            tbl.text('team_name');
            tbl.integer('account_moderator_id')
                .unsigned()
                .notNullable()
                .references('user_id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            tbl.text('admissions_email_address');
            tbl.text('visit_reporting_address');
            tbl.text('visit_reporting_instructions');
        })

};

exports.down = function(knex, Promise) {
    // drops the entire table
    return knex.schema
      .dropTableIfExists('teams')
  };
  
