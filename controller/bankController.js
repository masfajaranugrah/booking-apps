const Bank = require("../models/Bank");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  addBank: async (req, res) => {
    // console.log(req.body);
    const { bankName, accountHolder, accountNumber } = req.body;

    if (!req.file) {
      return res.status(404).json({ message: "Image Not Found" });
    }

    const bank = new Bank({
      bankName,
      accountHolder,
      accountNumber,
      imageUrl: `images/${req.file.filename}`,
    });

    try {
      await bank.save();
      res.status(201).json(bank);
    } catch (error) {
      await fs.unlink(path.join(`public/images/${req.file.filename}`));
      res.status(400).send({message : error.message});
    }
  },

  updateBank: async (req, res) => {
    // console.log(req.body);
    const updates = Object.keys(req.body);
    const allowedUpdates = ["bankName", "accountHolder", "accountNumber"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(403).json({ message: "Wrong Key Parameters" });
    }

    try {
      const bank = await Bank.findById(req.params.id);
      if (req.file == undefined) {
        updates.forEach((update) => {
          bank[update] = req.body[update];
        });
        await bank.save();
        res.status(200).json(bank);
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        updates.forEach((update) => {
          bank[update] = req.body[update];
        });
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        res.status(200).json(bank);
      }
    } catch (error) {
      await fs.unlink(path.join(`public/images/${req.file.filename}`));
      res.status(500).send({message : error.message});
    }
  },

  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();
      bank.length === 0
        ? res.status(404).json({ message: "No Data bank Found" })
        : res.status(200).json(bank);
    } catch (error) {
      res.status(500).send({message : error.message});
    }
  },

  deleteBank: async (req, res) => {
    try {
      const bank = await Bank.findByIdAndDelete(req.params.id);
      if (!bank) {
        res.status(404).send({ message: "bank Not Found" });
      } else {
        await bank
          .remove()
          .then(() => fs.unlink(path.join(`public/${bank.imageUrl}`)));
        res.status(200).json({ message: "Bank delete" });
      }
    } catch (error) {
      res.status(500).send({message : error.message});
    }
  },
};
