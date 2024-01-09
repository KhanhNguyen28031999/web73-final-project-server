const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const authRouter = require("./src/routes/authRoute");

const { connectToDB } = require("./src/utils/connectToDB");
const postRouter = require("./src/routes/postRoute");
const commentRoute = require("./src/routes/commentRoute");
const app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.use("/comments", commentRoute);
app.use("/auth", authRouter);
app.use("/posts", postRouter);

const port = 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectToDB();
});
