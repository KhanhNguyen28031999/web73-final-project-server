const Follower = require("../Model/Follower");

class followerController {
  async readFollower(req, res, next) {
    try {
      const id = req.user.userId;
      const result = await Follower.readFollower(id);
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
  async createFollower(req, res, next) {}
  async updateFollower(req, res, next) {}
  async deleteFollower(req, res, next) {}
}
module.exports = new followerController();
