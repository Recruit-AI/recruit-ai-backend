const server = require('../server.js');
const request = require('supertest');
// our connection to the database
const db = require('../data/dbConfig.js');
var knexCleaner = require('knex-cleaner');
const Users = require('../components/users/user-model.js');

const pantheon_info = {pantheon_name: "Testing"}
const pantheon_changes = {pantheon_name: "Testing2"}
let pantheon_object = {}
let pantheon_id = 0
const user_cred = {username: "pantheon_creator", password: "test", user_email: "pantheon_creator"}
let user_token = ""
let user_obj = {}

module.exports = describe("Pantheon Tests", () => {
    it("Finding user tests", async () => {
      await knexCleaner.clean(db)
      expect(1).toBe(1);
      const user_response = await request(server).post('/api/users/register').send(user_cred);
      user_obj = JSON.parse(user_response.text)
      const verify_response = await request(server).get(`/api/users/verify/${user_obj.user_id}`);
      const login_response = await request(server).post('/api/users/auth/login').send(user_cred);
      user_token = JSON.parse(login_response.text).token
      await Users.update({user_role:3}, user_obj.user_id)
      user_obj = await Users.findById(user_obj.user_id)
      expect(1).toBe(1);
  })

  it("Get all pantheons", async () => {
    const expectedStatusCode = 200;
    const response = await request(server).get('/api/pantheons');
    expect(response.status).toBe(expectedStatusCode);
  })
  it("Attempt creating pantheon without logging in", async () => {
      const expectedStatusCode = 400;
      const response = await request(server).post('/api/pantheons').send(pantheon_info);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create pantheon with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/pantheons').send(pantheon_info).set("Authorization", user_token);

      pantheon_object = JSON.parse(response.text)
      pantheon_id = pantheon_object.pantheon_id
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create pantheon with same name, expecting failure", async () => {
      const expectedStatusCode = 500;
      const response = await request(server).post('/api/pantheons').send(pantheon_info).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("GET the pantheon", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).get(`/api/pantheons/${pantheon_id}`);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Edit the pantheon", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).put(`/api/pantheons/${pantheon_id}`).send(pantheon_changes).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Delete the pantheon", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).delete(`/api/pantheons/${pantheon_id}`).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create pantheon with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/pantheons').send(pantheon_info).set("Authorization", user_token);

      pantheon_object = JSON.parse(response.text)
      pantheon_id = pantheon_object.pantheon_id
      expect(response.status).toBe(expectedStatusCode);
  })

})


require('./02a-pantheonHistories.js')
