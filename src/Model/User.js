const { ObjectId } = require("mongodb");
const { db } = require("../utils/connectToDB");
class User {
  async readStat(id) {
    const follower =
      (await db.followers.find({ following: new ObjectId(id) }).toArray()) ||
      [];
    const post =
      (await db.posts.find({ author: new ObjectId(id) }).toArray()) || [];

    const USER = (await db.users.findOne({ _id: new ObjectId(id) })) || [];
    const comments =
      (await db.comments.find({ author: USER.username }).toArray()) || [];

    const reactions =
      (await db.reactions.find({ userId: new ObjectId(id) }).toArray()) || [];

    const pipeline = [
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comment",
        },
      },
      { $unwind: "$comment" },
      {
        $lookup: {
          from: "reactions",
          localField: "_id",
          foreignField: "postId",
          as: "reaction",
        },
      },
      {
        $match: {
          author: new ObjectId(id),
        },
      },
      {
        $facet: {
          countComment: [{ $count: "comment" }],
          countReaction: [{ $count: "reaction" }],
        },
      },
    ];
    const [result] = await db.posts.aggregate(pipeline).toArray();
    return {
      followers: follower.length,
      posts: post.length,
      comments: comments.length,
      reactions: reactions.length,
      result,
    };
  }
}
module.exports = new User();
