require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`DevTinder Server is running on port number ${PORT}`);
    });
  } catch (err) {
    console.log("Failed to start DevTinder", err.message);
    process.exit(1);
  }
};

startServer();
