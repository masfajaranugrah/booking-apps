const User = require("../models/User");

module.exports = {
  addUser: async (req, res) => {
    try {
      // console.log(req.body);
      const { userName, email, password, passwordComfrim } = req.body;
      if (password !== passwordComfrim) {
        throw Error("Your Password Is Not Same With Password confirm");
      }

      const cekUserName = await User.find({
        userName: userName,
      }).count();
      const cekEmail = await User.find({
        email: email,
      }).count();
      if (cekUserName + cekEmail > 0) {
        throw Error("Email Or Username Ready Registered!");
      }

      const user = new User(req.body);

      await user.save();
      res.status(201).json({ message: "success Sing UP, Please Login !!" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  viewUser: async (req, res) => {
    try {
      const user = await User.find();
      user.length === 0
        ? res.status(404).json({ message: "No Data user Found" })
        : res.status(200).json(user);
    } catch (error) {
      res.status(500).json({message : error.message});
    }
  },

  updateUser: async (req, res) => {
    // console.log(req.body);
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "userName",
      "email",
      "role",
      "password",
      "passwordComfrim",
    ];
    const isValidOption = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOption) {
      return res.status(403).json({ message: "invailid key parameter" });
    }

    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }

      updates.forEach((update) => {
        user[update] = req.body[update];
      });

      await user.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({message : error.message});
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete({ _id: id });
      user
        ? res.status(200).json({ message: "user delete" })
        : res.status(404).send({ message: "user Not Found" });
    } catch (err) {
      res.status(500).json({message : error.message});
    }
  },

  login: async (req, res) => {
    // console.log(req.body);
    try {
      const user = await User.findByCredentials(
        req.body.email,
        req.body.password
      );

      const token = await user.generateAuthToken();

      const userName = user.userName;

      res.status(200).json({ userName, token });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  logOut: async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter(
        (token) => token.token !== req.user.token
      );

      await req.user.save();
      res.status(200).send({ mesage: "Sucess Logout" });
    } catch (err) {
      res.status(500).send({ message: error.message });
    }
  },

  logOutAll: async (req, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.status(200).send({ mesage: "Sucess Logout" });
    } catch (err) {
      res.status(500).json({message : err.message});
    }
  },

  viewMe: async (req, res)=> {
    res.send(req.user)
  }
};
