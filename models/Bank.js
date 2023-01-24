const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  bankName: {
    type: String,
    trim: true,
    required: [true, "Please input Bank Name!"],
  },
  accountHolder: {
    type: String,
    required: [true, "Please input account holder!"],
  },
  accountNumber: {
    type: String,
    required: [true, "Please input account number!"],
  },

  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Bank", bankSchema);
