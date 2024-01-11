const express = require("express");
const commentRoute = express.Router();
const commentController = require("../controllers/commentController");
const authenticateUser = require("../middlewares/authenticateUser");

//get all
commentRoute.get("/:postId", commentController.getComments);
//get by id
commentRoute.get("/:id", commentController.getCommentByID);
//create
commentRoute.post("/", authenticateUser, commentController.createComment);
//edit
commentRoute.put("/:id", authenticateUser, commentController.editComment);
//delete
commentRoute.delete("/:id", authenticateUser, commentController.deleteComment);

module.exports = commentRoute;
