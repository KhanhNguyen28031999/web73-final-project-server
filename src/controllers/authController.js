const { db } = require("../utils/connectToDB");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

const getAllUser = async (req, res) => {
  const user = await db.users.find().toArray();
  res.json(user);
};

const getUserByID = async (req, res) => {
  const id = req.params;
  const userId = new ObjectId(id);
  const user = await db.users.findOne({
    _id: userId,
  });
  res.json(user);
};

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
      avatar:
        "https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
      background:
        "https://inkythuatso.com/uploads/thumbnails/800/2022/04/anh-mau-xam-dep-103622756-06-15-55-21.jpg",
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
    const _id = new ObjectId(userId);
    const user = await db.users.findOne({ _id: _id });

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
        phonenumber: user.phonenumber,
        avatar: user.avatar,
        background: user.background,
        email: user.email,
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

const editUserByID = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, email, phonenumber, password } = req.body;
    const newUser = {
      username,
      email,
      phonenumber,
      password,
    };

    const result = await db.users.updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: newUser,
      }
    );
    res.status(201).json({
      msg: "Edit information successful !",
      data: result,
      isSuccess: true,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Edit failed !",
      data: null,
      isSuccess: false,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  getMyProfile,
  getAllUser,
  getUserByID,
  editUserByID,
};
