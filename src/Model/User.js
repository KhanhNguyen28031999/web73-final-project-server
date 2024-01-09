const { ObjectId } = require("mongodb");
const { db } = require("../utils/connectToDB");
class User {
  async readStat(id) {
    const follower =
      (await db.followers.find({ to: new ObjectId(id) }).toArray()) || [];
    const post =
      (await db.posts.find({ author: new ObjectId(id) }).toArray()) || [];
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
      result,
    };
  }
}
module.exports = new User();
