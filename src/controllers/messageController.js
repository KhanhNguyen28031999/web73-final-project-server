const Message = require("../Model/Message");

class messageController {
  async readMessage(req, res, next) {
    try {
      const { receiver } = req.query;
      const sender = req.user.userId;
      const result = await Message.readMessage(sender, receiver);
      if (result) {
        res.status(200).json({
          check: true,
          data: result,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        check: "false",
        msg: "Lỗi máy chủ",
      });
    }
  }
  async createMessage(req, res, next) {
    try {
      const { receiver, content } = req.body;
      const sender = req.user.userId;
      const result = await Message.createMessage(sender, receiver, content);
      if (result) {
        res.status(200).json({
          check: true,
          data: result,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        check: "false",
        msg: "Lỗi máy chủ",
      });
    }
  }
  async readMessageById(req, res, next) {
    try {
      const receiver = req.user.userId;
      const result = await Message.readMessageById(receiver);
      if (result) {
        res.status(200).json({
          check: true,
          data: result,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        check: "false",
        msg: "Lỗi máy chủ",
      });
    }
  }
  async updateMessage(req, res, next) {}
  async deleteMessage(req, res, next) {}
}
module.exports = new messageController();
