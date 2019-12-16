exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('athletes', tbl => {
            tbl.increments('athlete_id');
            tbl.text('preferred_name');
            tbl.integer('recruiting_personnel_id')
                .unsigned()
                .notNullable()
                .references('user_id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            tbl.integer('team_id')
                .unsigned()
                .notNullable()
                .references('user_id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            tbl.text('notes');
            tbl.json('application_process')
            tbl.text('first_name');
            tbl.text('last_name');
            tbl.text('email');
            tbl.text('phone');
            tbl.text('city');
            tbl.text('state');
            tbl.text('high_school_name');
            tbl.text('school_year');
            tbl.integer('height');
            tbl.integer('weight');
        })
};

exports.down = function (knex, Promise) {
    // drops the entire table
    return knex.schema
        .dropTableIfExists('athletes')
};

//   {
//     "athlete_id": 1,
//     "preferred_name": "Bob",
//     "recruiting_personnel_id": 2,
//     "notes": "",
//     "application_process": {
//         "step_one": true,
//         "step_two": true,
//         "step_three": false
//     },
//     "first_name": "Robert",
//     "last_name": "Something",
//     "email": "asdf@asdf.com",
//     "phone": "23167896305",
//     "city": "Cityopolis",
//     "state": "ST",
//     "high_school_name": "The High School",
//     "school_year": "Junior",
//     "height": 66,
//     "weight": 189
// }
