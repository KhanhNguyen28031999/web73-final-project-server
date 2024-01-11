const express = require("express");

const postController = require("../controllers/postController");
const authenticateUser = require("../middlewares/authenticateUser");
const postRouter = express.Router();

//create post
postRouter.post("/", authenticateUser, postController.createPost);
//get all post
postRouter.get("/", postController.getPosts);
//get post by id
postRouter.get("/:id", postController.getPostById);
//update post by id
postRouter.put("/:id", authenticateUser, postController.updatePost);
//delete post by id
postRouter.delete("/:id", postController.deletePost);

module.exports = postRouter;
