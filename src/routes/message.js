const express = require("express");

const messageController = require("../controllers/messageController");
const authenticateUser = require("../middlewares/authenticateUser");
const messageRouter = express.Router();

messageRouter.get("/", authenticateUser, messageController.readMessage);
messageRouter.post(
  "/message",
  authenticateUser,
  messageController.createMessage
);
messageRouter.get("/id", authenticateUser, messageController.readMessageById);
module.exports = messageRouter;
