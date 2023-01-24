const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Please input user name!"],
    },
    email: {
      type: String,
      required: [true, "Please input email"],
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw Error("Please enter a valid email address");
        }
      },
    },
    role: {
      type: String,
      enum: ["admin", "owner"],
      default: "owner",
    },
    password: {
      type: String,
      required: [true, "Please input password!"],
      minlenght: 7, //min caracter of password
      trim: true,
    },
    passwordComfrim: {
      type: String,
      required: [true, "Please input password!"],
      minlenght: 7, //min caracter of password
      trim: true,

      validate(value) {
        if (this.password !== this.passwordComfrim) {
          return true;
        }
      },
    },
    tokens: [
      {
        token: { type: String },
      },
    ],
  },
  { timestamps: true }
);
//generate tokens
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "fajar", {
    expiresIn: "1 days", // waktu berdasarkan gramer bahasa english
  });

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
// custom json convert
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.passwordComfrim;
  delete userObject.tokens;

  return userObject;
};

// login cek
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw Error("User Not Found");
  }

  const isMath = await bcrypt.compare(password, user.password);

  if (!isMath) {
    throw Error("Wrong Password");
  }

  return user;
};

// heshing password

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 7);
  }
  if (user.isModified("passwordComfrim")) {
    user.password = await bcrypt.hash(user.passwordComfrim, 7);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
