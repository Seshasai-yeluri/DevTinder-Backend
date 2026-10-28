const userService = require("../services/connectionService");

const createConnectionRequest = async (req, res) => {
  const { id } = req.user;
  const connectionDetails = await userService.createConnectionRequest(
    id,
    req.body,
  );

  return res.status(201).json({
    success: true,
    message: "Connection request sent successfully",
    connectionDetails: connectionDetails,
  });
};

const updateConnectionRequest = async (req, res) => {
  const { id } = req.user;
  const updatedConnectionDetails = await userService.updateConnectionStatus(
    id,
    req.body,
  );
  return res.status(200).json({
    success: true,
    message: "connection status updated successfully",
    connectionDetails: updatedConnectionDetails,
  });
};

module.exports = {
  createConnectionRequest,
  updateConnectionRequest,
};
