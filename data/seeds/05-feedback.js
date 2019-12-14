
exports.seed = function(knex) {
  return knex('feedbacks').insert([
    {
      feedback_kind: 1,
      feedback_message: "EXAMPLE Heyo, neat job guys! Do you support.......?",
      feedback_name: "John Johnson",
      feedback_email: "aseyjrsgx@gmail.com",
      logged: false
    },
    {
      feedback_kind: 1,
      feedback_message: "EXAMPLE Whoa this is something else, friend",
      feedback_name: "",
      feedback_email: "",
      logged: true
    },
    {
      feedback_kind: 2,
      feedback_message: "EXAMPLE I noticed this might be a bug but?",
      feedback_name: "",
      feedback_email: "",
      logged: false
    },
    {
      feedback_kind: 1,
      feedback_message: "EXAMPLE Heyo, neat job guys! Do you support.......?",
      feedback_name: "John Johnson",
      feedback_email: "aseyjrsgx@gmail.com",
      logged: true
    },

  ]);
};
