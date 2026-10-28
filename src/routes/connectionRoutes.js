const express = require("express");
const { authenticateAccessToken } = require("../middlewares/auth");
const connectionRouter = express.Router();
const connectionController = require("../controllers/connectionController");

connectionRouter.post(
  "/connectionRequest",
  authenticateAccessToken,
  connectionController.createConnectionRequest,
);

connectionRouter.patch(
  "/updateConnectionStatus",
  authenticateAccessToken,
  connectionController.updateConnectionRequest,
);

module.exports = connectionRouter;
