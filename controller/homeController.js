const Item = require("../models/Item");
const Info = require("../models/Info");
const Category = require("../models/Category");
const Bank = require("../models/Bank");

module.exports = {
  homePage: async (req, res) => {
    try {
      const hotItem = await Item.find()
        .select(
          "_id itemName location itemPrice unit imagedId sumBooked isPopuler"
        )
        .limit(5)
        .populate({
          path: "image",
          select: "_id imageUrl",
          option: { sort: { sumbooked: -1 } },
        });

      //! categoryList
      const categoryList = await Category.find({
        $where: "this.item.length > 0",
      })
        .limit(3)
        .populate({
          path: "item",
          select: "_id itemName location itemPrice unit imageId isPopuler",
          parDocumentLimit: 4,
          option: { sort: { sumbooked: -1 } },
          populate: {
            path: "image",
            partDocumentLimit: 1,
          },
        });

      //! testimony
      const testimony = await Info.find({
        type: "testimony",
        isHighlight: true,
      })
        .select("_id infoName type imageUrl description item")
        .limit(3)
        .populate({
          path: "item",
          select: "_id infoName location",
        });
      //! Hotel
      const Hotel = await Category.find({ categoryName: "Hotel" });
      const Event = await Category.find({ categoryName: "Event" });
      const Tour = await Category.find({ categoryName: "Tour Package" });

      const SumHotel = Hotel.reduce(
        (count, current) => count + current.item.length,
        0
      );
      const SumEvent = Event.reduce(
        (count, current) => count + current.item.length,
        0
      );
      const SumTour = Tour.reduce(
        (count, current) => count + current.item.length,
        0
      );

      res.status(200).json({
        summaryInfo: {
          sumHotel: SumHotel,
          sumEvent: SumEvent,
          sumTour: SumTour,
        },
        hotItem,
        categoryList,
        testimony,
      });

      //   end try
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.params;

      const item = await Item.findOne({ _id: id })
        .populate({ path: "category", select: "id categoryName" })
        .populate({ path: "image", select: "id imageUrl" })
        .populate({
          path: "info",
          match: { type: { $in: ["Testimony", "NearBy"] } },
        })
        .populate({ path: "feature" });

      const bank = await Bank.find();

      res.status(200).json({
        ...item._doc,
        bank,
      });
    } catch (error) {
      res.status(500).send({ message: err.message });
    }
  },
};
