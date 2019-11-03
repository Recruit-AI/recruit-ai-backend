const server = require('../server.js');
const request = require('supertest');
// our connection to the database
const db = require('../data/dbConfig.js');
const Users = require('../components/users/user-model.js');
var knexCleaner = require('knex-cleaner');

const symbol_info = {symbol_name: "Testing", symbol_kind_id: 0}
const kind_info = {kind_name: "Testing", creator_pantheon_id: 0}
const pantheon_info = {pantheon_name: "Testing"}
const symbol_changes = {symbol_name: "Testing2"}
let symbol_object = {}
let symbol_id = 0
const user_cred = {username: "symbol_creator", password: "test", user_email: "symbol_creator"}
let user_token = ""
let user_obj = {}

describe("Symbol Tests", () => {
  it("Finding symbol tests and creating test admin", async () => {
    await knexCleaner.clean(db)
    const user_response = await request(server).post('/api/users/register').send(user_cred);
    user_obj = JSON.parse(user_response.text)
    const verify_response = await request(server).get(`/api/users/verify/${user_obj.user_id}`);
    const login_response = await request(server).post('/api/users/auth/login').send(user_cred);
    user_token = JSON.parse(login_response.text).token
    await Users.update({user_role:3}, user_obj.user_id)
    user_obj = await Users.findById(user_obj.user_id)
    expect(1).toBe(1);
  })

  it("Get all symbols", async () => {
    const expectedStatusCode = 200;
    const response = await request(server).get('/api/symbols');
    expect(response.status).toBe(expectedStatusCode);
  })
  it("Create pantheon with auth", async () => {
      const expectedStatusCode = 201;

      const response = await request(server).post('/api/pantheons').send(pantheon_info).set("Authorization", user_token);
      pantheon_object = JSON.parse(response.text)
      kind_info.creator_pantheon_id = pantheon_object.pantheon_id
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create kind with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/kinds').send(kind_info).set("Authorization", user_token);
      kind_object = JSON.parse(response.text)
      symbol_info.symbol_kind_id = kind_object.kind_id
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Attempt creating symbol without logging in", async () => {
      const expectedStatusCode = 400;
      const response = await request(server).post('/api/symbols').send(symbol_info);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create symbol with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/symbols').send(symbol_info).set("Authorization", user_token);

      symbol_object = JSON.parse(response.text)
      symbol_id = symbol_object.symbol_id

      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create symbol with same name, expecting failure", async () => {
      const expectedStatusCode = 500;
      const response = await request(server).post('/api/symbols').send(symbol_info).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("GET the symbol", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).get(`/api/symbols/${symbol_id}`);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Edit the symbol", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).put(`/api/symbols/${symbol_id}`).send(symbol_changes).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Delete the symbol", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).delete(`/api/symbols/${symbol_id}`).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create symbol with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/symbols').send(symbol_info).set("Authorization", user_token);

      symbol_object = JSON.parse(response.text)
      symbol_id = symbol_object.symbol_id
      expect(response.status).toBe(expectedStatusCode);
  })

})


require('./05a-symbolConnections.js')
require('./05b-symbolsToPantheons.js')
