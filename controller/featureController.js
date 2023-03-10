const Item = require("../models/Item");
const Feature = require("../models/Feature");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  addFeature: async (req, res) => {
    // console.log(req.body);
    const { featureName, qty, item } = req.body;
    if (!req.file) {
      return res.status(404).send({ message: "item Not Found" });
    }
    try {
      const feature = await Feature.create({
        featureName,
        qty,
        item,
        imageUrl: `images/${req.file.filename}`,
      });

      const itemDb = await Item.findOne({ _id: item });
      itemDb.feature.push({ _id: feature._id });
      await itemDb.save();
      res.status(200).json(feature);
    } catch (error) {
      await fs.unlink(path.join(`public/images/${req.file.filename}`));
      res.status(500).send({message : error.message});
    }
  },
  viewFeature: async (req, res) => {
    try {
      const feature = await Feature.find().populate({
        path: "item",
        select: "id itemName",
      });

      feature.length === 0
        ? res.status(404).json({ message: "No Data feature Found" })
        : res.status(200).json(feature);
    } catch (error) {
      res.status(500).send({message : error.message});
    }
  },

  updateFeature: async (req, res) => {
    // console.log(req.body);

    const { id } = req.params;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["featureName", "qty", "item"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(403).json({ message: "Wrong Key Parameters" });
    }

    try {
      const feature = await Feature.findById({ _id: id });
      if (req.file == undefined) {
        updates.forEach((update) => {
          feature[update] = req.body[update];
        });
        await feature.save();
        res.status(200).json(feature);
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        updates.forEach((update) => {
          feature[update] = req.body[update];
        });
        feature.imageUrl = `images/${req.file.filename}`;
        await feature.save();
        res.status(200).json(feature);
      }
    } catch (error) {
      if (!req.body) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`));
      }
      res.status(500).send({message : error.message});
    }
  },

  deleteFeature: async (req, res) => {
    try {
      const { id } = req.params;
      const feature = await Feature.findOne({ _id: id });

      if (!feature) {
        return res.status(404).send({ message: "feature Not Found" });
      }

      async function deleteItem() {
        const itemDb = await Item.findOne({ _id: feature.item });

        for (let i = 0; i < itemDb.feature.length; i++) {
          if (itemDb.feature[i]._id.toString() === feature._id.toString()) {
            itemDb.feature.pull({ _id: feature._id });
            await itemDb.save();
          }
        }
      }

      await feature
        .remove()
        .then(() => deleteItem())
        .then(() => fs.unlink(path.join(`public/${feature.imageUrl}`)));

      res.status(200).json({ message: "feature delete" });
    } catch (error) {
      res.status(500).send({message : error.message});
    }
  },
};
