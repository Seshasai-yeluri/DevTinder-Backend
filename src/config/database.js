const mongoose = require("mongoose");

const connectDB = async () => {
  const connect = await mongoose.connect(process.env.DATABASE_URL);
  console.log(
    `Database is connect successfully, HOST : ${connect.connection.host}`,
  );
};

module.exports = connectDB;
