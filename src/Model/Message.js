const { ObjectId } = require("mongodb");
const { db } = require("../utils/connectToDB");
class Message {
  async readMessage(sender, receiver) {
    const left =
      (await db.messages
        .find({ author: new ObjectId(sender), to: new ObjectId(receiver) })
        .toArray()) || [];
    const right =
      (await db.messages
        .find({ author: new ObjectId(receiver), to: new ObjectId(sender) })
        .toArray()) || [];
    var res = [];
    left.map((ell) => {
      res.push({
        from: sender,
        to: receiver,
        content: ell.content,
        createAt: ell.createAt,
      });
    });
    right.map((elr) => {
      res.push({
        from: sender,
        to: receiver,
        content: elr.content,
        createAt: elr.createAt,
      });
    });
    res.sort((a, b) => a.createAt - b.createAt);
    return res;
  }
  async createMessage(sender, receiver, content) {
    console.log(content);
    const result = await db.messages.insertOne({
      _id: new ObjectId(),
      author: new ObjectId(sender),
      to: new ObjectId(receiver),
      content: content,
      createAt: new Date(),
      status: false,
    });
    console.log(result);
    return result;
  }
  async readMessageById(receiver) {
    try {
      const pipeline = [
        {
          $match: {
            author: new ObjectId(receiver),
          },
        },
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
      ];
      const [result] = await db.messages.aggregate(pipeline).toArray();
      return [result];
    } catch (error) {
      return [];
    }
  }
  async updateMessage(message) {}
  async deleteMessage(message) {}
}
module.exports = new Message();
