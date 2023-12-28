const { MongoClient } = require("mongodb");

//setup database
const URL = "mongodb://localhost:27017";
const DATABASE = "Project";

const db = {};

// create connection to database
async function connectToDB() {
  const client = new MongoClient(URL);
  await client.connect();
  const database = client.db(DATABASE);

  //setup collection
  db.users = database.collection("users");
  db.posts = database.collection("posts");
}

module.exports = { connectToDB, db };
