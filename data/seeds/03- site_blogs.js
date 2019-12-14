
exports.seed = function(knex) {
  return knex('site_blogs').insert([
    {
      author_id: 1,
      blog_title: "Gamma Version Release",
      blog_text: "Right now, you can see the view of the core.",
      blog_tags: ['development', 'release'],
      blog_category: "News"
    },
    {
      author_id: 4,
      blog_title: "A Good Tip For Recruiting",
      blog_text: "Here is an example of a blog you could release for natural SEO.",
      blog_tags: ['recruiters', 'tips'],
      blog_category: "Blog"
    },
    {
      author_id: 4,
      blog_title: "When To Do a Quick Recruit",
      blog_text: "Here is an example of a blog you could release for natural SEO.",
      blog_tags: ['recruiters', 'legal'],
      blog_category: "Blog"
    },
    {
      author_id: 4,
      blog_title: "When To Do a Quick Recruit",
      blog_text: "Here is an example of a blog you could release for natural SEO.",
      blog_tags: ['recruiters', 'tips'],
      blog_category: "Blog"
    },
    {
      author_id: 4,
      blog_title: "Conduct Reminders in a Technological Age",
      blog_text: "Here is an example of a blog you could release for natural SEO.",
      blog_tags: ['conduct', 'legal'],
      blog_category: "Blog"
    },
    {
      author_id: 4,
      blog_title: "Other Blog Examples",
      blog_text: "Here is an example of a blog you could release for natural SEO.",
      blog_tags: ['coaches', 'tips'],
      blog_category: "Blog"
    },
    {
      author_id: 2,
      blog_title: "Another News Example",
      blog_text: "Here is an example of a blog you could release for natural SEO.",
      blog_tags: ['development', 'release'],
      blog_category: "News"
    },


  ]);
};
