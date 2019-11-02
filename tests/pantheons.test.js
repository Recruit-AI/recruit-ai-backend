const server = require('../server.js');
const request = require('supertest');
// our connection to the database
const db = require('../data/dbConfig.js');


describe("Pantheon Tests", () => {
  it("Finding pantheon tests", async () => {
    await db.raw('TRUNCATE TABLE pantheons CASCADE');
    expect(1).toBe(1);
  })
  //Get size of all pantheons to be 0
  //Create a new pantheon without logging in
  //Create one after logging in
  //Create one of the same name, expecting failure

  //Get the pantheon

  //Edit the pantheon
  //Delete the pantheon
  //Add it again.
})
