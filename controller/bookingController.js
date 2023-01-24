const Booking = require("../models/Booking");
const Item = require("../models/Item");
const Customer = require("../models/Customer");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  addBooking: async (req, res) => {
    try {
      const {
        itemId,
        itemBooked,
        bookingStartDate,
        bookingEndtDate,
        fristName,
        lastName,
        email,
        phoneNumber,
        bankFrom,
        accountHolder,
      } = req.body;

      //   console.log(req.body);

      if (!req.file) {
        return res.status(400).json({ message: "Image Not Flond" });
      }

      if (
        itemId === undefined ||
        itemBooked === undefined ||
        bookingStartDate === undefined ||
        bookingEndtDate === undefined ||
        fristName === undefined ||
        lastName === undefined ||
        email === undefined ||
        phoneNumber === undefined ||
        bankFrom === undefined ||
        accountHolder === undefined
      ) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`));
        return res.status(400).json({ message: "Please Input All Data" });
      }

      const item = await Item.findOne({ _id: itemId });
      if (!item) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`));
        return res.status(400).json({ message: "Item Not Flond" });
      }

      let total = item.itemPrice * itemBooked;
      let tax = total * 0.1;

      const invoice = Math.floor(1000000 + Math.random() * 900000);

      const customer = await Customer.create({
        fristName,
        lastName,
        email,
        phoneNumber,
      });

      const newBooking = {
        invoice,
        bookingStartDate,
        bookingEndtDate,
        total: (total += tax),
        item: {
          _id: item._id,
          name: item.itemName,
          price: item.itemPrice,
          booked: itemBooked,
        },
        customer: customer.id,
        payments: {
          ProfPayment: `images/${req.file.filename}`,
          bankFrom: bankFrom,
          accountHolder: accountHolder,
        },
      };
      const booking = await Booking.create(newBooking);

      res.status(201).json({ message: "success Booking", booking });
    } catch (err) {
      if (req.file) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`));
      }

      return res.status(400).json({ message: err.message });
    }
  },

  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.find();
      booking.length === 0
        ? res.status(404).json({ message: "No Data Booking Found" })
        : res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ meesasge: err.message });
    }
  },

  showDetailBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id }).populate("customer");

      booking.length === 0
        ? res.status(404).json({ message: "No Data Booking Found" })
        : res.status(200).json(booking);
    } catch (err) {
      res.status(500).json({ meesasge: err.message });
    }
  },

  actionReject: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      if (booking.payments.status === "Reject") {
        return res.status(403).json({ message: "Booking Order Alredy Reject" });
      }

      if (booking.payments.status === "Accept") {
        return res.status(403).json({ message: "Booking Order Alredy Accept" });
      }

      booking.payments.status = "Reject";
      booking.ProfBy = req.user._id;
      await booking.save();
      res.status(200).json(booking);
    } catch (err) {
      res.status(500).json({ meesasge: err.message });
    }
  },

  actionAccept: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });

      const {
        item: { _id, booked },
      } = booking;

      const item = await Item.findOne({ _id: _id });

      if (booking.payments.status === "Reject") {
        return res.status(403).json({ message: "Booking Order Alredy Reject" });
      }

      if (booking.payments.status === "Accept") {
        return res.status(403).json({ message: "Booking Order Alredy Accept" });
      }
      item.sumBooked += parseInt(booked);

      booking.payments.status = "Accept";
      booking.ProfBy = req.user._id;
      await item.save();
      await booking.save();
      res.status(200).json(booking);
    } catch (err) {
      res.status(500).json({ meesasge: err.message });
    }
  },

  deleteBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id });
      if (!booking) {
        return res.status(400).json({ message: "Booking not found" });
      }

      const {
        payments: { status, ProfPayment },
      } = booking;

      if (status != "Process") {
        return res
          .status(403)
          .json({ message: "noly can delete booking with status Process" });
      }

      await booking
        .remove()
        .then(() => fs.unlink(path.join(`public/${ProfPayment}`)));
      res.status(200).json({ message: "delete success" });
    } catch (err) {
      res.status(500).json({ meesasge: err.message });
    }
  },
};
