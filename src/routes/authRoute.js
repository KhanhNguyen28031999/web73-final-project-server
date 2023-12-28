const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const authenticateUser = require("../middlewares/authenticateUser");

//create new account
authRouter.post("/register", authController.registerController);

//create new login
authRouter.post("/login", authController.loginController);

//my profile
authRouter.get("/me", authenticateUser, authController.getMyProfile);

module.exports = authRouter;
