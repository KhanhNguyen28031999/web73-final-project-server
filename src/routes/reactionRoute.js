const express = require("express");

const reactionController = require("../controllers/reactionController");
const authenticateUser = require("../middlewares/authenticateUser");

const reactsRouter = express.Router();

reactsRouter.get("/:id", reactionController.getReaction);

reactsRouter.post("/:id", reactionController.createReaction);

module.exports = reactsRouter;
