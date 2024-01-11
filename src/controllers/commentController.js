const { ObjectId } = require("mongodb");
const { db } = require("../utils/connectToDB");

//get all
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await db.comments
      .find({ postId: { $eq: postId } })
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
const getCommentByID = (req, res) => {};

//create
const createComment = async (req, res) => {
  try {
    const { userId } = req.user;
    const _id = new ObjectId(userId);
    const now = new Date();
    const dateString = now.toISOString();
    const { postId, content } = req.body;
    const postID = new ObjectId(postId);
    const newComment = {
      postID,
      content,
      author: _id,
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
        newComment,
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
