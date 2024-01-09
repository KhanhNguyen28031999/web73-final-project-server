const { ObjectId } = require("mongodb");
const { db } = require("../utils/connectToDB");

//get all
const getComment = (req, res) => {};

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
    const newComment = {
      postId,
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
  getComment,
  getCommentByID,
  createComment,
  editComment,
  deleteComment,
};
