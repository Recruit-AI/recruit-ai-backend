const server = require('../server.js');
const request = require('supertest');
// our connection to the database
const db = require('../data/dbConfig.js');
const Users = require('../components/users/user-model.js');

const category_info = {category_name: "Testing"}
const category_changes = {category_name: "Testing2"}
let category_object = {}
let category_id = 0
const user_cred = {username: "category_creator", password: "test", user_email: "category_creator"}
let user_token = ""
let user_obj = {}

describe("Category Tests", () => {
  it("Finding category tests and creating test admin", async () => {
    const user_response = await request(server).post('/api/users/register').send(user_cred);
    user_obj = JSON.parse(user_response.text)
    const verify_response = await request(server).get(`/api/users/verify/${user_obj.user_id}`);
    await Users.update({user_role:3}, user_obj.user_id)
    const login_response = await request(server).post('/api/users/auth/login').send(user_cred);
    user_token = JSON.parse(login_response.text).token
    user_obj = await Users.findById(user_obj.user_id)
    expect(1).toBe(1);
  })

  it("Get all categories", async () => {
    const expectedStatusCode = 200;
    const response = await request(server).get('/api/categories');
    expect(response.status).toBe(expectedStatusCode);
  })
  it("Attempt creating category without logging in", async () => {
      const expectedStatusCode = 400;
      const response = await request(server).post('/api/categories').send(category_info);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create category with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/categories').send(category_info).set("Authorization", user_token);

      category_object = JSON.parse(response.text)
      category_id = category_object.category_id
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create category with same name, expecting failure", async () => {
      const expectedStatusCode = 500;
      const response = await request(server).post('/api/categories').send(category_info).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("GET the category", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).get(`/api/categories/${category_id}`);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Edit the category", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).put(`/api/categories/${category_id}`).send(category_changes).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Delete the category", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).delete(`/api/categories/${category_id}`).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create category with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/categories').send(category_info).set("Authorization", user_token);

      category_object = JSON.parse(response.text)
      category_id = category_object.category_id
      expect(response.status).toBe(expectedStatusCode);
  })

})




require('./04a-categoryPrereqs.js')
require('./04b-categoriesToPantheons.js')
require('./04c-categoriesToSymbols.js')
require('./04d-categoriesToKinds.js')
