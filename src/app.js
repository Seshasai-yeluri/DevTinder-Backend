const express = require("express");
const crypto = require("node:crypto");
const router = require("./routes/userRoutes");
const connectionRouter = require("./routes/connectionRoutes");
const httpLogger = require("pino-http");
const logger = require("./utils/logger");
const APIError = require("./utils/APIError");
const app = express();
require("../src/workers/emailWorker");

app.use(express.json()); //converts JSON into JavaScript Objects

app.use(
  httpLogger({
    logger,
    genReqId: (req, res) => {
      const requestId = crypto.randomUUID();
      res.setHeader("X-Request-ID", requestId);
      return requestId;
    },
    customProps: (req, res) => ({
      requestBody: req.body,
      responseBody: res.locals.responseBody,
    }),
  }),
); // http request logging

app.use((req, res, next) => {
  //involving response body in logging
  const originalJson = res.json;

  res.json = function (body) {
    res.locals.responseBody = body;
    return originalJson.call(this, body);
  };
  next();
});

//Routes
app.use("/api/users", router);
app.use("/api/connection", connectionRouter);

//Sending 404 when no route found
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

//Global error handling middleware
app.use((err, req, res, next) => {
  const name = err.name;
  const errors = err.errors;
  const statusCode = err.statusCode ?? 500;

  let message;

  if (statusCode >= 500 || !(err instanceof APIError)) {
    message = "Internal Server Error";
  } else {
    message = err.message;
  }

  if (statusCode >= 400 && statusCode <= 499) {
    req.log.warn({ err }, "Request failed");
  } else if (statusCode >= 500) {
    req.log.error({ err }, "Request failed");
  }

  return res.status(statusCode).json({
    success: false,
    message: message,
    errors: errors,
  });
});

module.exports = app;
