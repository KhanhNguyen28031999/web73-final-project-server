const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const { db } = require("../utils/connectToDB");

//get Posts
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const skip = (page - 1) * pageSize;
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $facet: {
          paginatedPosts: [{ $skip: skip }, { $limit: pageSize }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];
    console.log(pipeline);
    const [result] = await db.posts.aggregate(pipeline).toArray();
    console.log(result);
    const { paginatedPosts, totalCount } = result;
    const totalPosts = totalCount.length > 0 ? totalCount[0].count : 0;
    const totalPages = Math.ceil(totalPosts / pageSize);
    res.status(200).json({
      message: "Get post list successful",
      data: paginatedPosts,
      page,
      pageSize,
      totalPages,
      totalCount: totalPosts,
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

// get post by id

const getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await db.posts.findOne({
      _id: new ObjectId(id),
    });
    res.status(200).json({
      message: "Get post detail by id successful",
      data: post,
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

// create new post

const createPost = async (req, res) => {
  try {
    const { userId } = req.user;
    const _id = new ObjectId(userId);
    const { title, content, hashtags } = req.body;
    const post = {
      title,
      content,
      hashtags,
      author: _id,
    };
    await db.posts.insertOne(post);
    res.status(201).json({
      message: "Create a post successful",
      data: post,
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

// update Post

const updatePost = async (req, res) => {
  const { title, content, author, hashtags } = req.body;
  try {
    const id = req.params.id;
    await db.posts.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: title,
          content: content,
          author: author,
          hashtags: hashtags,
        },
      }
    );
    res.status(200).json({
      message: "Bài viết đã được cập nhật !",
      data: { ...req.body, id: id },
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

// Delete post

const deletePost = async (req, res) => {
  const id = req.params.id;
  try {
    await db.posts.deleteOne({
      _id: new ObjectId(id),
    });
    res.status(200).json({
      message: "Xoá bài viết thành công !",
      data: { id },
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

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
