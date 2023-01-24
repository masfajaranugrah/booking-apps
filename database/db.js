const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const coon = await mongoose.connect("mongodb://127.0.0.1:27017/bookingDB", {
      userNewUrlPaser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`mogoodb connection : ${coon.connection.host}`);
  } catch (err) {
    console.error(`error : ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDb;
