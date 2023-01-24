const Category = require("../models/Category");

module.exports = {
  addCategory: async (req, res) => {
    // console.log(req.body);

    const category = new Category({
      ...req.body,
    });

    try {
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(404).send({message : error.message});
    }
  },
  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      category.lenght === 0
        ? res.status(404).json({ message: "No Data Category Found" })
        : res.status(200).json(category);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  updateCategory: async (req, res) => {
    // console.log(req.body);
    const updates = Object.keys(req.body);
    const allowedUpdates = ["categoryName"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(403).json({ message: "Invalid Key Parameters" });
    }

    try {
      const category = await Category.findById(req.params.id);
      updates.forEach((update) => {
        category[update] = req.body[update];
      });
      await category.save();
      res.status(200).json(category);
    } catch (error) {
      res.status(500).send({message : error.message});
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      category
        ? res.status(200).json({ message: "Cateegory delete" })
        : res.status(404).send({ message: "Category Not Found" });
    } catch (error) {
      res.status(500).send({message : error.message});
    }
  },
};
