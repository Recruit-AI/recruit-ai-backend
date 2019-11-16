/*
This is for connecting a kind (list) to a symbol (description)
As in, "Tarot Cards" under "Divination types" should have a little thing at the top that says, 
"This page is about Tarot Cards as a Divination Type. To see the list of Tarot Cards, please click here."

and, vice versa, "This is a list of all of the Tarot Cards. To see more about Tarot Cards as a 
Divination Type, please click here."
*/
exports.up = function(knex, Promise) {
    return knex.schema
    .createTable('kind_symbol_connections', tbl => {
        tbl.increments('kind_symbol_connection_id');
        tbl.integer('ksc_kind_id')
        .unsigned()
        .notNullable()
        .references('kind_id')
        .inTable('kinds')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
        tbl.integer('ksc_symbol_id')
        .unsigned()
        .notNullable()
        .references('symbol_id')
        .inTable('symbols')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('kind_symbol_connections');
};

