exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('site_pages', tbl => {
            tbl.increments('site_page_id');
            tbl.text('page_title')
            tbl.text('page_body_text')
            tbl.text('page_category')
            tbl.text('page_symbol')
            tbl.integer('page_order').defaultTo(0)
        })

};

exports.down = function (knex, Promise) {
    // drops the entire table
    return knex.schema
        .dropTableIfExists('site_pages')
};

