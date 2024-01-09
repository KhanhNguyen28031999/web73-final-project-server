const User = require("../Model/User");

class userController {
  async getStat(req, res) {
    try {
      const id = req.user.userId;
      const result = await User.readStat(id);
      if (result) {
        res.status(200).json({
          check: true,
          data: result,
        });
      } else {
        res.status(404).json({
          check: false,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
        isSuccess: false,
      });
    }
  }
}
module.exports = new userController();
