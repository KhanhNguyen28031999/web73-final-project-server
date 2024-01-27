const express = require("express");

const userController = require("../controllers/userController");
const authenticateUser = require("../middlewares/authenticateUser");
const userRouter = express.Router();

userRouter.get("/stat", authenticateUser, userController.getStat);
userRouter.get("/stat/:userId", userController.getStatById);
module.exports = userRouter;
