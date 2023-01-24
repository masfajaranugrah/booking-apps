const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Authentification

const auth = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.header("Authorization"));
    if (!req.header("Authorization")) {
      throw new Error("Sorry Only Admin Can ");
    }
    const token = await req.header("Authorization").replace("Bearer", "");

    const decoded = jwt.verify(token, "fajar");

    const user = await User.findOne({
      _id: decoded,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error("Token invailed");
    }
    
    req.user = user;
    req.user.token = token;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = auth;
