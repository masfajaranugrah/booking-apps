const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const infoSchema = new mongoose.Schema({
  infoName: {
    type: String,
    required: [true, "Please input info Name!"],
  },
  type: {
    type: String,
    anum : ["Testimony", "NearBy"],
    required: [true, "Please input info Type!"],
  },
  isHighlight: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: [true, "Please input Item Description!"],
  },
  imageUrl: {
    type: String,
    required: true,
  },
  item: [
    {
      type: ObjectId,
      ref: "Item",
    },
  ],
});

module.exports = mongoose.model("Info", infoSchema);
