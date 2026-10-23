const mongoose = require("mongoose");

const connectDB = async () => {
  const { DATABASE_URL } = process.env;

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  mongoose.connection.on("connected", () => {
    console.log("Database connection established");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Database connection lost");
  });

  mongoose.connection.on("error", (error) => {
    console.log("Database connection error", error.message);
  });

  const connect = await mongoose.connect(process.env.DATABASE_URL);

  console.log(
    `Database is connect successfully, HOST : ${connect.connection.host}`,
  );
};

module.exports = connectDB;
