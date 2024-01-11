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
  async getUser(req, res) {
    try {
      const id = req.user.userId;
      const result = await User.readUser(id);
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
  async getUserById(req, res) {
    try {
      const id = req.user.userId;
      const result = await User.readUserById(id);
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
  async updateUser(req, res) {
    try {
      const id = req.user.userId;
      const { name, email, phonenumber } = req.body;
      const result = await User.updateUser(name, email, phonenumber, id);
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
  async updatePassword(req, res) {
    try {
      const id = req.user.userId;
      const { curpass, newpass } = req.body;
      const result = await User.updatePassword(curpass, newpass, id);
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
