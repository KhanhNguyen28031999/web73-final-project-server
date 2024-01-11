const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const authRouter = require("./src/routes/authRoute");

const { connectToDB } = require("./src/utils/connectToDB");
const postRouter = require("./src/routes/postRoute");
const commentRoute = require("./src/routes/commentRoute");
const userRouter = require("./src/routes/user");
const messageRouter = require("./src/routes/message");
const followerRouter = require("./src/routes/follower");
const app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/comments", commentRoute);
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/users", userRouter);
app.use("/messages", messageRouter);
app.use("/followers", followerRouter);
const port = 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectToDB();
});
