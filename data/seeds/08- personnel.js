
exports.seed = function(knex) {
  return knex('end_users').insert([
    {
      foreign_user_id: 5,
      team_id: 1,
      team_verified: true,
      user_first_name: "LeRoy",
      user_last_name: "Gardner",
      user_professional_title: "Coach",
      user_display_name: "Coach Gardner",
      athlete_watch_list: []
    }, 


    //SMALL TEAM

    {
      foreign_user_id: 6,
      team_id: 2,
      team_verified: true,
      user_first_name: "Small",
      user_last_name: "Coach",
      user_professional_title: "Head Coach",
      user_display_name: "The Head Coach",
      athlete_watch_list: []
    },
    {
      foreign_user_id: 7,
      team_id: 2,
      team_verified: true,
      user_first_name: "Small2",
      user_last_name: "Coach",
      user_professional_title: "Asst. Coach",
      user_display_name: "Coach A",
      athlete_watch_list: []
    },
    {
      foreign_user_id: 8,
      team_id: 2,
      team_verified: true,
      user_first_name: "Small3",
      user_last_name: "Coach",
      user_professional_title: "Asst. Coach",
      user_display_name: "Coach B",
      athlete_watch_list: []
    },


    //BIG TEAM

    {
      foreign_user_id: 9,
      team_id: 3,
      team_verified: true,
      user_first_name: "Big",
      user_last_name: "Coach",
      user_professional_title: "Head Coach",
      user_display_name: "The Head Coach",
      athlete_watch_list: []
    },
    {
      foreign_user_id: 10,
      team_id: 3,
      team_verified: true,
      user_first_name: "Big2",
      user_last_name: "Coach",
      user_professional_title: "Asst. Coach",
      user_display_name: "Coach A",
      athlete_watch_list: []
    },
    {
      foreign_user_id: 11,
      team_id: 3,
      team_verified: true,
      user_first_name: "Big3",
      user_last_name: "Coach",
      user_professional_title: "Asst. Coach",
      user_display_name: "Coach B",
      athlete_watch_list: []
    },
    {
      foreign_user_id: 12,
      team_id: 3,
      team_verified: true,
      user_first_name: "Big",
      user_last_name: "Coach",
      user_professional_title: "Asst Coach",
      user_display_name: "Coach C",
      athlete_watch_list: []
    },
    {
      foreign_user_id: 13,
      team_id: 3,
      team_verified: true,
      user_first_name: "Big2",
      user_last_name: "Recruiter",
      user_professional_title: "Recruiter",
      user_display_name: "Recruiter A",
      athlete_watch_list: []
    },
    {
      foreign_user_id: 14,
      team_id: 3,
      team_verified: true,
      user_first_name: "Big3",
      user_last_name: "Recruiter",
      user_professional_title: "Asst. Recruiter",
      user_display_name: "Recruiter B",
      athlete_watch_list: []
    },
    {
      foreign_user_id: 15,
      team_id: 3,
      team_verified: true,
      user_first_name: "Big3",
      user_last_name: "Officer",
      user_professional_title: "Compliance Officer",
      user_display_name: "CO",
      athlete_watch_list: []
    },

  ])


};
