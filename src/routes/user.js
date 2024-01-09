const express = require("express");

const userController = require("../controllers/userController");
const authenticateUser = require("../middlewares/authenticateUser");
const userRouter = express.Router();

userRouter.get("/", authenticateUser, userController.getStat);

module.exports = userRouter;
