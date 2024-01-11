const { ObjectId } = require("mongodb");
const { db } = require("../utils/connectToDB");
const bcrypt = require("bcrypt");
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
          foreignField: "postID",
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
      { $unwind: "$reaction" },
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
  async readUser(id) {
    const result =
      (await db.users
        .find(
          { _id: { $nin: [new ObjectId(id)] } },
          { projection: { _id: 1, name: 1 } }
        )
        .toArray()) || [];
    return result;
  }
  async readUserById(id) {
    const result =
      (await db.users.find({ _id: new ObjectId(id) }).toArray()) || [];
    return result;
  }
  async updateUser(name, email, phonenumber, id) {
    const result = await db.users.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name: name,
          email: email,
          phonenumber: phonenumber,
        },
      }
    );
    return result;
  }
  async updatePassword(curpass, newpass, id) {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(newpass, saltRound);
    const result = await db.users.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    return result;
  }
}
module.exports = new User();
