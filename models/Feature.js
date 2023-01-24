const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const featureSchema = new mongoose.Schema({
  featureName: {
    type: String,
    required: [true, "Please input Feature Name!"],
  },
  qty: {
    type: Number,
    required: [true, "Please input Feature Qunatity!"],
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

module.exports = mongoose.model("Feature", featureSchema);
