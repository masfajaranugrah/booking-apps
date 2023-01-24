const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const coon = await mongoose.connect("mongodb+srv://admin:W4VTVJww3GFs1pGh@fajar.f49iaat.mongodb.net/bookingDB?retryWrites=true&w=majority", {
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
