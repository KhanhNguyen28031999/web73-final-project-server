const express = require("express");

const followerController = require("../controllers/followerController");
const authenticateUser = require("../middlewares/authenticateUser");
const followerRouter = express.Router();

followerRouter.get("/", authenticateUser, followerController.readFollower);
followerRouter.post(
  "/follower",
  authenticateUser,
  followerController.createFollower
);

module.exports = followerRouter;
