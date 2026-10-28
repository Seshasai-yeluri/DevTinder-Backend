const express = require("express");
const router = require("./routes/userRoutes");
const connectionRouter = require("./routes/connectionRoutes");

const app = express();

app.use(express.json()); //converts JSON into JavaScript Objects
app.use("/api/users", router);
app.use("/api/connection", connectionRouter);

app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  const message = err.message || "Internal Server Error";
  const name = err.name;
  const errors = err.errors;
  const statusCode = err.statusCode ?? 500;
  return res.status(statusCode).json({
    success: false,
    message: message,
    errors: errors,
  });
});

module.exports = app;
