const pino = require("pino");

const isProduction = process.env.ENVIRONMENT === "production";

const logger = pino({
  level: "info",
  base: {
    service: "node-backend",
    environment: process.env.ENVIRONMENT,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "accessToken",
    ],
    censor: "[REDACTED]",
  },
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      }),
});

module.exports = logger;
