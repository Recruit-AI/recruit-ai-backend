
exports.seed = function(knex) {
  return knex('support_tickets').insert([
    {
      support_ticket_kind: 1,
      support_ticket_message: "Hey, I think this is broke, it shouldn't have done this",
      support_ticket_name: "Bob Bobson",
      support_ticket_email: "Someone@some.com",
      require_update: true,
      support_ticket_state: "open",
      public_notes_text: "We are currently investigating the issue.",
      private_notes_text: "I think I know what the cause is. I'll check it out."
    },
    {
      support_ticket_kind: 1,
      support_ticket_message: "Hey, I think this is broke, it shouldn't have done this",
      support_ticket_name: "Bob Bobson",
      support_ticket_email: "Someone@some.com",
      require_update: true,
      support_ticket_state: "pending",
      public_notes_text: "We are currently investigating the issue.",
      private_notes_text: "I think I know what the cause is. I'll check it out."
    },
    {
      support_ticket_kind: 2,
      support_ticket_message: "Hey, I think this is broke, it shouldn't have done this",
      support_ticket_name: "Bob Bobson",
      support_ticket_email: "Someone@some.com",
      require_update: true,
      support_ticket_state: "closed",
      public_notes_text: "We are currently investigating the issue.",
      private_notes_text: "I think I know what the cause is. I'll check it out."
    }

  ]);
};
