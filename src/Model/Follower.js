const { ObjectId } = require("mongodb");
const { db } = require("../utils/connectToDB");
class Follower {
  async readFollower(id) {
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "from",
          foreignField: "_id",
          as: "from",
        },
      },
      {
        $unwind: "$from",
      },
      {
        $lookup: {
          from: "users",
          localField: "to",
          foreignField: "_id",
          as: "to",
        },
      },
      {
        $unwind: "$to",
      },
      {
        $match: {
          "from._id": new ObjectId(id),
        },
      },
      {
        $project: {
          "from._id": 1,
          "from.name": 1,
          "to._id": 1,
          "to.name": 1,
        },
      },
    ];

    const result = await db.followers.aggregate(pipeline).toArray();
    return result;
  }

  async createFollower(from, to) {
    const result = await db.followers.insertOne({
      _id: new ObjectId(),
      from: new ObjectId(from),
      to: new ObjectId(to),
    });
    return result;
  }
  async updateFollower(message) {}
  async deleteFollower(message) {}
}
module.exports = new Follower();
