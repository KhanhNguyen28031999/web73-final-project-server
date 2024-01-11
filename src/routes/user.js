const express = require("express");

const userController = require("../controllers/userController");
const authenticateUser = require("../middlewares/authenticateUser");
const userRouter = express.Router();

userRouter.get("/stat", authenticateUser, userController.getStat);
userRouter.get("/", authenticateUser, userController.getUser);
userRouter.get("/id", authenticateUser, userController.getUserById);
userRouter.put("/info", authenticateUser, userController.updateUser);
userRouter.put("/password", authenticateUser, userController.updatePassword);
module.exports = userRouter;
