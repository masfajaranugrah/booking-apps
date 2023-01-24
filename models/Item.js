const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const itemSchema = new mongoose.Schema({
  itemName: {
    type: "String",
    required: [true, "Please input Item Name!"],
  },
  itemPrice: {
    type: Number,
    required: [true, "Please input Item Price!"],
  },

  unit: {
    type: String,
    required: [true, "Please input Item Unit!"],
  },
  sumBooked: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    required: [true, "Please input Item location!"],
  },
  isPopuler: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: [true, "Please input Item Description!"],
  },
  category: {
    type: ObjectId,
    ref: "Category",
  },
  image: [
    {
      type: ObjectId,
      ref: "Image",
    },
  ],
  feature: [
    {
      type: ObjectId,
      ref: "Feature",
    },
  ],
  info: [
    {
      type: ObjectId,
      ref: "Info",
    },
  ],
});

module.exports = mongoose.model("Item", itemSchema);
