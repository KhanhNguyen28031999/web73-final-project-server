const { ObjectId } = require("mongodb");
const { db } = require("../utils/connectToDB");

//get all
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await db.comments
      .find({ postID: new ObjectId(postId) })
      .sort({ createAt: -1 })
      .toArray();
    if (!comments.length) {
      res.status(404).json({
        message: "Comments for postId not found",
        data: null,
        isSuccess: false,
      });
      return;
    }
    res.status(200).json({
      msg: "Get all comment success",
      data: comments,
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
      isSuccess: false,
    });
  }
};
//get cmt by id
const getCommentByID = async (req, res) => {
  try {
    const id = req.params;
    const _id = new ObjectId(id);
    const comment = await db.comments.findOne({ _id: _id });
    res.status(200).json({
      msg: "Successful",
      data: comment,
      isSuccess: true,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Failed",
      data: null,
      isSuccess: false,
    });
  }
};

//create
const createComment = async (req, res) => {
  try {
    const { userId } = req.user;
    const _userId = new ObjectId(userId);
    const username = await db.users.findOne({ _id: _userId });
    const name = username.username;
    const now = new Date();
    const dateString = now.toISOString();
    const { postId, content } = req.body;
    const postID = new ObjectId(postId);
    const author = name;
    const newComment = {
      _userId,
      postID,
      content,
      author: author,
      createdAt: dateString,
    };
    await db.comments.insertOne(newComment);
    res.status(201).json({
      message: "Comment created successful",
      data: newComment,
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
      isSuccess: false,
    });
  }
};

//put cmt by id
const editComment = async (req, res) => {
  try {
    const { content } = req.body;
    const id = req.params;
    const newComment = {
      content,
    };
    await db.comments.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: { newComment },
      }
    );
    res.status(201).json({
      msg: "Update comment successful",
      data: newComment,
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
      isSuccess: false,
    });
  }
};

//delete comment
const deleteComment = async (req, res) => {
  try {
    await db.comments.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.status(200).json({
      msg: "Comment has deleted successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
      isSuccess: false,
    });
  }
};

module.exports = {
  getComments,
  getCommentByID,
  createComment,
  editComment,
  deleteComment,
};
