const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { connectToDB } = require("../src/utils/connectToDB");
const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectToDB();
});
