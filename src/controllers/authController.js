const { db } = require("../utils/connectToDB");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ObjectID } = require("mongodb");

const registerController = async (req, res) => {
  const saltRound = 10;
  try {
    const { username, password, email, phonenumber } = req.body;
    const checkExistAccount = await db.users.findOne({
      $or: [{ username }, { email }, { phonenumber }],
    });
    if (checkExistAccount) {
      const errorMessage =
        checkExistAccount.username === username
          ? "Username đã tồn tại."
          : checkExistAccount.email === email
          ? "Email đã được sử dụng."
          : "Số điện thoại đã được sử dụng.";
      res.status(409).json({
        message: errorMessage,
        data: null,
        isSuccess: false,
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, saltRound);
    const newUser = await db.users.insertOne({
      username,
      password: hashedPassword,
      email,
      phonenumber,
    });
    res.status(201).json({
      message: "Đăng ký thành công",
      data: newUser,
      isSuccess: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Máy chủ hiện đang đóng. Xin vui lòng thử lại sau.",
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.users.findOne({ username });
    if (!user) {
      res.status(401).json({
        message: "Username không tồn tại !",
        data: null,
        isSuccess: false,
      });
      return;
    }
    const checkMatchPassword = await bcrypt.compare(password, user.password);

    if (!checkMatchPassword) {
      res.status(401).json({
        message: "Sai mật khẩu !",
        data: null,
        isSuccess: false,
      });
      return;
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
    res.status(201).json({
      message: "Đăng nhập thành công",
      data: {
        user,
        token,
      },
      isSuccess: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Máy chủ hiện đang đóng. Xin vui lòng thử lại sau.",
      data: null,
      isSuccess: false,
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await db.users.findOne({ _id: new ObjectID(userId) });

    if (!user) {
      res.status(404).json({
        message: "User not found !",
        data: null,
        isSuccess: false,
      });
    }
    res.status(200).json({
      message: "Get my profile successful",
      user: {
        _id: user._id,
        username: user.username,
      },
      isSuccess: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Máy chủ hiện đang đóng. Xin vui lòng thử lại sau.",
      data: null,
      isSuccess: false,
    });
  }
};

module.exports = { registerController, loginController, getMyProfile };
