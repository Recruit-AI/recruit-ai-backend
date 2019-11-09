const server = require('../server.js');
const request = require('supertest');
const db = require('../data/dbConfig.js');
var knexCleaner = require('knex-cleaner');
const Users = require('../components/users/user-model.js');

const pantheon_info = {pantheon_name: "Testing"}
let pantheon_id = 0
const hpantheon_info = {pantheon_name: "Testing2"}
let hpantheon_id = 0
const ipantheon_info = {pantheon_name: "Testing3"}
let ipantheon_id = 0
let history_info = {influencer_id: 0, influenced_id: 0}
let influenced_info =  {influencer_id: 0, influenced_id: 0}
let history_object = {}
let influenced_object = {}
const user_cred = {username: "pantheon_creator", password: "test", user_email: "pantheon_creator"}
const bcrypt = require('bcryptjs')
const user_hash = bcrypt.hashSync("pantheon_creator", 2)

let user_token = ""
let user_obj = {}

module.exports = describe("***", () => {describe("Pantheon Tests", () => {
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

  //Create the second and third pantheons
  it("Create pantheon with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/pantheons').send(pantheon_info).set("Authorization", user_token);
      pantheon_id = JSON.parse(response.text).pantheon_id
      history_info.influenced_id = pantheon_id
      influenced_info.influencer_id = pantheon_id
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create pantheon with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/pantheons').send(hpantheon_info).set("Authorization", user_token);
      history_info.influencer_id = JSON.parse(response.text).pantheon_id
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create pantheon with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/pantheons').send(ipantheon_info).set("Authorization", user_token);
      influenced_info.influenced_id = JSON.parse(response.text).pantheon_id
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create pantheon_history", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/pantheons/histories').send(history_info).set("Authorization", user_token);
      history_object = JSON.parse(response.text)
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create pantheon_history", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/pantheons/histories').send(influenced_info).set("Authorization", user_token);
      influenced_object = JSON.parse(response.text)
      expect(response.status).toBe(expectedStatusCode);
  })
  it("GET the pantheon", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).get(`/api/pantheons/${pantheon_id}`);
      expect(response.status).toBe(expectedStatusCode);

      const fullObj = JSON.parse(response.text)
      expect(fullObj.history.length).toBe(1)
      expect(fullObj.history[0].pantheon_name).toBe("Testing2")

      expect(fullObj.influenced.length).toBe(1)
      expect(fullObj.influenced[0].pantheon_name).toBe("Testing3")
  })
  it("Edit pantheon_history", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).put(`/api/pantheons/histories/${history_object.pantheon_history_id}`).send(influenced_info).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Delete pantheon_history", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).delete(`/api/pantheons/histories/${history_object.pantheon_history_id}`).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })

  })
})
