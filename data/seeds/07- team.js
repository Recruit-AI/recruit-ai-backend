
exports.seed = function(knex) {
  return knex('teams').insert([
    {
      "team_name": "GFU State Wrestling",
      "account_moderator_id": 5,
      "admissions_email_address": "admissions@gfu.com",
      "visit_reporting_address": "4567 Main St, Somewhere Rd., ST 24366",
      "visit_reporting_instructions": "This is the address to the parking garage. Follow signs for the student union & report in at the visitor center."
    },
    {
      "team_name": "Somewhere Wrestling",
      "account_moderator_id": 6,
      "admissions_email_address": "admissions@gfu.com",
      "visit_reporting_address": "4567 Main St, Somewhere Rd., ST 24366",
      "visit_reporting_instructions": "This is the address to the parking garage. Follow signs for the student union & report in at the visitor center."
    },
    {
      "team_name": "Ohio State Wrestling",
      "account_moderator_id": 9,
      "admissions_email_address": "admissions@gfu.com",
      "visit_reporting_address": "4567 Main St, Somewhere Rd., ST 24366",
      "visit_reporting_instructions": "This is the address to the parking garage. Follow signs for the student union & report in at the visitor center."
    },
    


  ]);
};
