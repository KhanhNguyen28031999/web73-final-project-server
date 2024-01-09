const { ObjectId } = require("mongodb");
const { db } = require("../utils/connectToDB");
class Follower {
  async readFollower(id) {
    // const res =
    //   (await db.followers.find({ from: new ObjectId(id) }).toArray()) || [];
    const pipeline = [
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
          from: new ObjectId(id),
        },
      },
    ];
    const [result] = await db.followers.aggregate(pipeline).toArray();
    return result;
  }
  async createFollower(from, to) {
    const result = await db.followers.insertOne({
      _id: new ObjectId(),
      from: new ObjectId(from),
      to: new ObjectId(to),
    });
    console.log(result);
    return result;
  }
  async updateFollower(message) {}
  async deleteFollower(message) {}
}
module.exports = new Follower();
