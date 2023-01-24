const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
  bookingStartDate: {
    type: Date,
    required: [true, "Please input start Date!"],
  },
  bookingEndtDate: {
    type: Date,
    required: true,
  },
  invoice: {
    type: String,
    required: true,
  },
  item: {
    _id: {
      type: ObjectId,
      ref: "Item",
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    booked: { type: Number, required: true },
  },
  total: { type: Number, required: true },
  customer: [
    {
      type: ObjectId,
      ref: "Customer",
    },
  ],

  payments: {
    ProfPayment: { type: String, required: true }, //! data gambar bukti bayar
    bankFrom: { type: String, required: true },
    accountHolder: { type: String, required: true },
    status: { type: String, default: "Process" },
  },

  ProfBy: {
    type: ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
