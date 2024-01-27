const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const authenticateUser = require("../middlewares/authenticateUser");

authRouter.get("/users", authController.getAllUser);
authRouter.get("/users/:id", authController.getUserByID);
//create new account
authRouter.post("/register", authController.registerController);

//create new login
authRouter.post("/login", authController.loginController);

//put user by id
authRouter.put("/users/:id", authenticateUser, authController.editUserByID);

//my profile
authRouter.get("/me", authenticateUser, authController.getMyProfile);

module.exports = authRouter;
