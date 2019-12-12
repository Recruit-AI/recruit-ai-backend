exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('site_blogs', tbl => {
            tbl.increments('site_blog_id');
            tbl.integer('author_id')
                .unsigned()
                .notNullable()
                .references('user_id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            tbl.text('blog_title')
            tbl.text('blog_text')
            tbl.specificType('blog_tags', 'text ARRAY');
            tbl.text('blog_category')

        })

};

exports.down = function (knex, Promise) {
    // drops the entire table
    return knex.schema
        .dropTableIfExists('site_blogs')
};


