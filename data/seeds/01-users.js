
const bcrypt = require('bcryptjs') 
const password = bcrypt.hashSync("1234!Asdf", 10)

exports.seed = function (knex) {
    return knex('users').insert([
        //The lead/developer who can see EVERYTHING for debugging purposes
        {
            password: password,
            username: "AdminJH",
            user_email: "Thejhubbs@gmail.com",
            user_role: 3,
            user_kind: "admin_user",
            user_verified: true
        },
        {
            password: password,
            username: "AdminLG",
            user_email: "leroy@gmail.com",
            user_role: 3,
            user_kind: "admin_user",
            user_verified: true
        },
        //An admin/moderator that can do pretty much everything except see some personal info
        {
            password: password,
            username: "ExampleAdmin",
            user_email: "Admin@gmail.com",
            user_role: 2,
            user_kind: "admin_user",
            user_verified: true
        },
        //A developer/designer/whatever you want to allow access to things like pages & posts, but other regular permissions
        {
            password: password,
            username: "ExampleDev",
            user_email: "Developer@gmail.com",
            user_role: 1,
            user_kind: "admin_user",
            user_verified: true
        },

        //Your personal test profile
        {
            password: password,
            username: "LGardner",
            user_email: "leroy.gardner@gmail.com",
            user_role: 1,
            user_kind: "end_user",
            user_verified: true
        },
        
        //A small test team
        {
            password: password,
            username: "SmallHeadCoach1",
            user_email: "coach1@gmail.com",
            user_role: 1,
            user_kind: "end_user",
            user_verified: true
        },
        {
            password: password,
            username: "SmallAsstCoach1",
            user_email: "smassistant@gmail.com",
            user_role: 1,
            user_kind: "end_user",
            user_verified: true
        },
        {
            password: password,
            username: "SmallAsstCoach2",
            user_email: "smassistant2@gmail.com",
            user_role: 1,
            user_kind: "end_user",
            user_verified: true
        },

        //A big test team
        {
            password: password,
            username: "TestHeadCoach1",
            user_email: "tcoach1@gmail.com",
            user_role: 1,
            user_kind: "end_user",
            user_verified: true
        },
        {
            password: password,
            username: "TestAsstCoach1",
            user_email: "assistant@gmail.com",
            user_role: 1,
            user_kind: "end_user",
            user_verified: true
        },
        {
            password: password,
            username: "TestAsstCoach2",
            user_email: "assistant2@gmail.com",
            user_role: 1,
            user_kind: "end_user",
            user_verified: true
        },
        {
            password: password,
            username: "TestAsstCoach3",
            user_email: "assistant3@gmail.com",
            user_role: 1,
            user_kind: "end_user",
            user_verified: true
        },
        {
            password: password,
            username: "TestRecruiter",
            user_email: "recruiter@gmail.com",
            user_role: 1,
            user_kind: "end_user",
            user_verified: true
        },
        {
            password: password,
            username: "TestRecruiter2",
            user_email: "recruiter2@gmail.com",
            user_role: 1,
            user_kind: "end_user",
            user_verified: true
        },
        {
            password: password,
            username: "TestCompliance",
            user_email: "officer@gmail.com",
            user_role: 1,
            user_kind: "end_user",
            user_verified: true
        }
    ]);
};
