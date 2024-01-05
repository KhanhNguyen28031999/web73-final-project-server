const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  const token = await req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token is not provided" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(process.env.SECRET_KEY);
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authenticateUser;
