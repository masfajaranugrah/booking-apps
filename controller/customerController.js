const Customer = require("../models/Customer");

module.exports = {
  addCustomer: async (req, res) => {
    const customer = new Customer({
      ...req.body,
    });

    try {
      await customer.save();
      res.status(201).json(customer);
    } catch (err) {
      res.status(400).json({message : err.message});
    }
  },

  viewCustomer: async (req, res) => {
    try {
      const customer = await Customer.find().populate({
        path: "item",
        select: "id itemName",
      });

      customer.length === 0
        ? res.status(404).json({ message: "No Data Customer Found" })
        : res.status(200).json(customer);
    } catch (err) {
      res.status(500).json({message : err.message});
    }
  },

  updateCustomer: async (req, res) => {
    // console.log(req.body);
    const updates = Object.keys(req.body);
    const allowedUpdates = ["fristName", "lastName", "email", "phoneNumber"];
    const isValidOpertaion = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOpertaion) {
      return res.status(403).json({ message: "Invalid key parameter" });
    }

    try {
      const customer = await Customer.findById({ _id: id });

      if (!customer) {
        res.status(404).json({ message: "Customer not found" });
      }
      updates.forEach((update) => {
        customer[update] = req.body[update];
      });

      await customer.save();
      res.status(200).json(customer);
    } catch (err) {
      res.status(500).json({message : err.message});
    }
  },
  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await Customer.findByIdAndDelete({ _id: id });
      customer
        ? res.status(200).json({ message: "Customer delete" })
        : res.status(404).send({ message: "Customer Not Found" });
    } catch (err) {
      res.status(500).json({message : err.message});
    }
  },
};
