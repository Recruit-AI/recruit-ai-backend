const server = require('../server.js');
const request = require('supertest');
const db = require('../data/dbConfig.js');
var knexCleaner = require('knex-cleaner');
const Users = require('../components/users/user-model.js');

const category_info = {category_name: "Testing"}
let category_id = 0
const hcategory_info = {category_name: "Testing2"}
let hcategory_id = 0
const icategory_info = {category_name: "Testing3"}
let icategory_id = 0
let main_info = {cp_category_id: 0, cp_prereq_id: 0}
let prerequisite_info =  {cp_category_id: 0, cp_prereq_id: 0}
let main_object = {}
let prerequisite_object = {}
const user_cred = {username: "category_creator", password: "test", user_email: "category_creator"}
let user_token = ""
let user_obj = {}

module.exports = describe("***", () => {
  describe("CategoryPrereq Tests", () => {
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

  //Create the second and third categories
  it("Create category with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/categories').send(category_info).set("Authorization", user_token);
      category_id = JSON.parse(response.text).category_id
      main_info.cp_prereq_id = category_id
      prerequisite_info.cp_category_id = category_id
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create category with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/categories').send(hcategory_info).set("Authorization", user_token);
      main_info.cp_category_id = JSON.parse(response.text).category_id
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create category with auth", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/categories').send(icategory_info).set("Authorization", user_token);
      prerequisite_info.cp_prereq_id = JSON.parse(response.text).category_id
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create category_history", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/categories/prerequisites').send(main_info).set("Authorization", user_token);
      main_object = JSON.parse(response.text)
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Create category_history", async () => {
      const expectedStatusCode = 201;
      const response = await request(server).post('/api/categories/prerequisites').send(prerequisite_info).set("Authorization", user_token);
      prerequisite_object = JSON.parse(response.text)
      expect(response.status).toBe(expectedStatusCode);
  })
  it("GET the category", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).get(`/api/categories/${category_id}`);
      expect(response.status).toBe(expectedStatusCode);

      const fullObj = JSON.parse(response.text)
      expect(fullObj.prerequisites.length).toBe(1)
      expect(fullObj.prerequisites[0].category_name).toBe("Testing3")

      expect(fullObj.advanced.length).toBe(1)
      expect(fullObj.advanced[0].category_name).toBe("Testing2")
  })
  it("Edit category_history", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).put(`/api/categories/prerequisites/${main_object.category_prereq_id}`).send(prerequisite_info).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })
  it("Delete category_history", async () => {
      const expectedStatusCode = 200;
      const response = await request(server).delete(`/api/categories/prerequisites/${main_object.category_prereq_id}`).set("Authorization", user_token);
      expect(response.status).toBe(expectedStatusCode);
  })

  })
})
