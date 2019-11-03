// const server = require('./api/server.js');
//
// const request = require('supertest');
//
// const good_username = "t"+ new Date().toString()
// const good_password = "Test"
// const bad_password = "test"
// const new_user = {username: good_username, password: good_password, teacher_name: "Mr. Jordan", email: "thejhubbs@gmail.com"}
// const good_cred = {username: good_username, password: good_password}
// const bad_cred = {username: good_username, password: bad_password}
//
// describe("Register endpoints", () => {
//   describe("Register endpoint", () => {
//     it("Register normally", async () => {
//         const expectedStatusCode = 201;
//         const response = await request(server).post('/api/teachers/register').send(new_user);
//         expect(response.status).toBe(expectedStatusCode);
//     })
//     it("Register with exact same credentials", async () => {
//         const expectedStatusCode = 500;
//         const response = await request(server).post('/api/teachers/register').send(new_user);
//         expect(response.status).toBe(expectedStatusCode);
//     })
//   })
//   describe("Login endpoint", () => {
//     it("Login With Wrong Password", async () => {
//         const expectedStatusCode = 500;
//         const response = await request(server).post('/api/teachers/login').send(bad_cred);
//         expect(response.status).toBe(expectedStatusCode);
//
//     })
//     it("Login With Correct Password", async () => {
//         const expectedStatusCode = 201;
//         const response = await request(server).post('/api/teachers/login').send(good_cred);
//         expect(response.status).toBe(expectedStatusCode);
//     })
//   })
//   describe("Start scoring", () => {
//     it("Start scoring normally & Retry to grab and expect same object", async () => {
//         const expectedStatusCode = 201;
//         //Login
//         const response = await request(server).post('/api/teachers/login').send(good_cred);
//         expect(response.status).toBe(expectedStatusCode);
//         //Call it first time
//         const score1 = await request(server).post('/api/scores/start').set('Authorization', response.body.token)
//         expect(score1.status).toBe(201)
//         const s1_id = score1.body.score_id
//         //Call it the second time
//         const score2 = await request(server).post('/api/scores/start').set('Authorization', response.body.token)
//         expect(score2.status).toBe(201)
//         const s2_id = score2.body.score_id
//         //Make sure the ids are the same
//         expect(s1_id).toBe(s2_id)
//     })
//   })
//   describe("End scoring", () => {
//     it("End the scoring", async () => {const expectedStatusCode = 201;
//
//     const response = await request(server).post('/api/teachers/login').send(good_cred);
//     expect(response.status).toBe(expectedStatusCode);
//
//     const score1 = await request(server).put('/api/scores/end').set('Authorization', response.body.token)
//     expect(score1.status).toBe(201)
//     })
//   })
//
//
//
//
//
// })



///Pantheons, Kinds, Categories, Symbols
//Resources
//Images, Sources
//Logs
