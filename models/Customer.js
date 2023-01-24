const mongoose = require("mongoose");
const validator = require("validator");

const customerSchema = new mongoose.Schema({
  fristName: {
    type: String,
    trim: true,
    required: [true, "Please input fest Name!"],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Please input fest Name!"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Please input email"],
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw Error("Please enter a valid email address");
      }
    },
  },
  phoneNumber: {
    type: String,
    required: [true, "Please input phone number!"],
  },
});

module.exports = mongoose.model("Customer", customerSchema);
