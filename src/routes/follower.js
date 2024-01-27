const express = require("express");

const followerController = require("../controllers/followerController");
const authenticateUser = require("../middlewares/authenticateUser");
const followerRouter = express.Router();

followerRouter.get("/", authenticateUser, followerController.getFollower);
followerRouter.post("/", authenticateUser, followerController.createFollower);
followerRouter.delete(
  "/:id",
  authenticateUser,
  followerController.deleteFollower
);

module.exports = followerRouter;
