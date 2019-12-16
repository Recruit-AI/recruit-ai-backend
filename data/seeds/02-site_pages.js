
exports.seed = function(knex) {
  return knex('site_pages').insert([
    {
      page_title: "Overview",
      page_body_text: `<h2>Introducing RecruitAI</h2>
      <p>Designed to simply every aspect of the recruiting process.</p>
      <h4>Add Your Team</h4>
      <p>Add your whole staff, coaches, recruiters, and compliance officers, or just use personally and get the 
      same benefits.</p>
      <a href="/pages/2/">Learn More</a>
      <h4>Track Your Recruits</h4><p>Sort & track every step of application process, 
      high school year, stats, and regions. Schedule and confirm visits, and auto-send 
      confirmations & alerts.</p>
      <a href="/pages/3/">Learn More</a>
      <h4>Stay Updated</h4><p>Automatic alerts & reminders set after both inactivity and activity.</p>
      <a href="/pages/4/">Learn More</a>
      <h4>Keep In Contact</h4>
      <p>Easily message recruits & automatically send confirmations to their personal number.</p>
      <a href="/pages/5/">Learn More</a>
      <h3>This & More Coming Soon</h3>`,
      page_category: "Features",
      page_order: 1,
      page_symbol: "star",
    },
    {
      page_title: "Add Your Team",
      page_body_text: `<h2>Add your coaches, your recruiters, and everyone who matters</h2>
      <p>Keep track of all team recruits in one place</p>
      <p>Create a team profile for coaches, recruiters, and other necessary personnel.</p>
      <p>Easily compile reports to be viewed by a compliance officer</p>
      <a href="/users/register" class="nice-button">Sign Up For The Official Release</a><br />
      <a href="/pages/1">>See The Other Features<</a>`,
      page_category: "Features",
      page_order: 2,
      page_symbol: "user-plus",
    },
    {
      page_title: "Track Your Recruits",
      page_body_text: `<h2>Every Step of The Process</h2><p>Sort & search by stats & information- height, weight, grade, state, school, and more.</p><p>Keep track of application process- every step along the way- from visits to application to financial aid to classes</p><p>All messages in one place- saved and backed up</p><a href="/users/register" class="nice-button">Sign Up For The Official Release</a><br /><a href="/pages/1">>See The Other Features<</a>`,
      page_category: "Features",
      page_order: 3,
      page_symbol: "users",
    },
    {
      page_title: "Stay Updated",
      page_body_text: `<h2>Alerts & Reminders</h2><p>Alerts for inactivity- if it's been one week since their reply, or one month since they update they promised. Set future alerts.</p><p>Alerts for confirming & upcoming visits- get alerts when the recruit confirms the visit, and 3 days before.</p><p>Timeframes are available for change in settings.</p><a href="/users/register" class="nice-button">Sign Up For The Official Release</a><br /><a href="/pages/1">>See The Other Features<</a>`,
      page_category: "Features",
      page_order: 4,
      page_symbol: "bell",
    },
    {
      page_title: "Keep In Contact",
      page_body_text: `<h2>Stay in contact, stay safe</h2><p>Message recruits without cluttering up your own personal phone- or remembering where you wrote it down.</p><p>Save message history on the server for compliance and archival.</p><p>Allow the recruit the convenience of messaging back through SMS on their own personal phone, exactly the same as traditional texting to them.</p><a href="/users/register" class="nice-button">Sign Up For The Official Release</a><br /><a href="/pages/1">>See The Other Features<</a>`,
      page_category: "Features",
      page_order: 5,
      page_symbol: "comment-dots",
    },

    
    {
      page_title: "Contact",
      page_body_text: "<h5>Please contact us at contact@recruitai.co</h5><p>If you have feedback or a problem, you can find the appropriate links in the menu.</p>",
      page_category: "About",
      page_order: 5,
      page_symbol: "envelope",
    },
    {
      page_title: "The Team",
      page_body_text: "",
      page_category: "About",
      page_order: 5,
      page_symbol: "user-tie",
    },
    {
      page_title: "Mission Statement",
      page_body_text: "",
      page_category: "About",
      page_order: 5,
      page_symbol: "star",
    },



  ]);
};
