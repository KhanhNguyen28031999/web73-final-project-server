const { db } = require("../utils/connectToDB");
const { ObjectId } = require("mongodb");

const getFollower = async (req, res) => {
  try {
    const getAllFollower = await db.followers.find().toArray();
    res.status(200).json({
      msg: "Get success !",
      data: getAllFollower,
      isSuccess: true,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Get failed",
      data: null,
      isSuccess: false,
    });
  }
};

const createFollower = async (req, res) => {
  try {
    const { followingUserId } = req.body;
    const { userId } = req.user;

    // Check if userId and followingUserId are valid ObjectId's
    const followerId = new ObjectId(userId);
    const followingId = new ObjectId(followingUserId);

    // Find the user to follow
    const followingUser = await db.users.findOne({ _id: followingId });

    if (!followingUser) {
      return res.status(404).json({ error: "User to follow not found" });
    }

    // Create the follow document
    const followDocument = {
      follower: followerId,
      following: followingId,
      followedAt: new Date(),
    };

    // Insert the follow document into the follow collection
    const result = await db.followers.insertOne(followDocument);

    // Update the followersCount for the user being followed
    await db.users.updateOne(
      { _id: followingId },
      { $inc: { followersCount: 1 } }
    );

    // Return success response
    res.status(200).json({
      message: "Follow successful",
      data: followDocument,
      isSuccess: true,
    });
  } catch (err) {
    console.error("Error during follow:", err);

    // If there's an error, return a 500 status with an error message
    res.status(500).json({
      msg: "Failed to follow user",
      data: null,
      isSuccess: false,
    });
  }
};

const deleteFollower = async (req, res) => {
  const id = req.params;
  const idFollower = new ObjectId(id);
  try {
    await db.followers.deleteOne({ _id: idFollower });
    res.status(200).json({
      msg: "Huỷ follow thành công !",
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.messenger,
      isSuccess: false,
    });
  }
};

module.exports = { createFollower, getFollower, deleteFollower };
