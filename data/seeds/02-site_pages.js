
exports.seed = function(knex) {
  return knex('site_pages').insert([
    {
      page_title: "Overview",
      page_body_text: "",
      page_category: "Features",
      page_order: 1
    },
    {
      page_title: "Add Your Team",
      page_body_text: "",
      page_category: "Features",
      page_order: 2
    },
    {
      page_title: "Track Your Recruits",
      page_body_text: "",
      page_category: "Features",
      page_order: 3
    },
    {
      page_title: "Stay Updated",
      page_body_text: "",
      page_category: "Features",
      page_order: 4
    },
    {
      page_title: "Keep In Contact",
      page_body_text: "",
      page_category: "Features",
      page_order: 5
    },

    
    {
      page_title: "Contact",
      page_body_text: "",
      page_category: "About",
      page_order: 5
    },
    {
      page_title: "The Team",
      page_body_text: "",
      page_category: "About",
      page_order: 5
    },
    {
      page_title: "Mission Statement",
      page_body_text: "",
      page_category: "About",
      page_order: 5
    },



  ]);
};
