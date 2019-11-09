const server = require('../server.js');
const request = require('supertest');
// our connection to the database
const db = require('../data/dbConfig.js');
var knexCleaner = require('knex-cleaner');
const Users = require('../components/users/user-model.js');

const kind_info = {kind_name: "Testing", creator_pantheon_id: 0}
const kind_changes = {kind_name: "Testing2"}
const pantheon_info = {pantheon_name: "Testing"}
let kind_object = {}
let kind_id = 0
let pantheon_object = {}
const user_cred = {username: "pantheon_creator", password: "test", user_email: "pantheon_creator"}
const bcrypt = require('bcryptjs')
const user_hash = bcrypt.hashSync("pantheon_creator", 2)

let user_token = ""
let user_obj = {}

module.exports = describe("Kind Tests", () => {
    it("Finding user tests", async () => {
      await knexCleaner.clean(db)
      expect(1).toBe(1);
      const user_response = await request(server).post('/api/users/auth/register').send(user_cred);
      user_obj = JSON.parse(user_response.text).user
      const verify_response = await request(server).get(`/api/users/auth/verify/${user_obj.user_id}/${encodeURIComponent(user_hash)}`);
      const login_response = await request(server).post('/api/users/auth/login').send(user_cred);
      user_token = JSON.parse(login_response.text).token
      await Users.update({user_role:3}, user_obj.user_id)
      user_obj = await Users.findById(user_obj.user_id)
      expect(1).toBe(1);
  })

  it("Get all kinds", async () => {
    const expectedStatusCode = 200;
    const response = await request(server).get('/api/kinds');
    expect(response.status).toBe(expectedStatusCode);
  })
  it("Create pantheon with auth", async () => {
      const expectedStatusCode = 201;

      const response = await request(server).post('/api/pantheons').send(pantheon_info).set("Authorization", user_token);
      pantheon_object = JSON.parse(response.text)
      kind_info.creator_pantheon_id = pantheon_object.pantheon_id
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Attempt creating kind without logging in", async () => {
      const expectedStatusCode = 400;
      const response = await request(server).post('/api/kinds').send(kind_info);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create kind with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/kinds').send(kind_info).set("Authorization", user_token);

      kind_object = JSON.parse(response.text)
      kind_id = kind_object.kind_id
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create kind with same name, expecting failure", async () => {
      const expectedStatusCode = 400;
      const response = await request(server).post('/api/kinds').send(kind_info).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("GET the kind", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).get(`/api/kinds/${kind_id}`);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Edit the kind", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).put(`/api/kinds/${kind_id}`).send(kind_changes).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Delete the kind", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).delete(`/api/kinds/${kind_id}`).set("Authorization", user_token);

      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create kind with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/kinds').send(kind_info).set("Authorization", user_token);
      kind_object = JSON.parse(response.text)
      kind_id = kind_object.kind_id
      expect(response.status).toBe(expectedStatusCode);
  })

})



require('./03a-kindsToPantheons.js')
