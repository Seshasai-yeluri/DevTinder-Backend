const connectionRepository = require("../repositories/connectionRepository");
const APIError = require("../utils/APIError");
const userRepository = require("../repositories/userRepository");

const requestValidation = async (fromUserId, toUserId) => {
  if (String(fromUserId) === String(toUserId)) {
    throw new APIError("Cannot send request to yourself", 400);
  }

  const fromUserDetails = await userRepository.findUserById(fromUserId);

  if (!fromUserDetails) {
    throw new APIError("Sender user not found", 404);
  }

  const toUserDetails = await userRepository.findUserById(toUserId);

  if (!toUserDetails) {
    throw new APIError("Recipient user not found", 404);
  }
};

const createConnectionRequest = async (id, connectionDetails) => {
  const fromUserId = id;
  const { toUserId } = connectionDetails;

  await requestValidation(fromUserId, toUserId);

  const connectionStatusDetails =
    await connectionRepository.findConnectionStatus(fromUserId, toUserId);

  if (connectionStatusDetails) {
    throw new APIError("Connection request already exists", 409);
  }

  const details = await connectionRepository.createConnectionRequest(
    fromUserId,
    connectionDetails,
  );
  return details;
};

const updateConnectionStatus = async (id, connectionDetails) => {
  const { connectionRequestId, status } = connectionDetails;

  const currentConnectionDetails =
    await connectionRepository.findConnectionRequestById(connectionRequestId);

  if (!currentConnectionDetails) {
    throw new APIError("No data found", 404);
  }

  if (String(currentConnectionDetails.toUserId) !== String(id)) {
    throw new APIError("User don't have permission for this action", 403);
  }

  if (!["Accepted", "Rejected"].includes(status)) {
    throw new APIError("Not a valid status", 400);
  }

  if (currentConnectionDetails?.status !== "Interested") {
    throw new APIError("Cannot perform this action", 409);
  }
  const updatedConnectionDetails =
    await connectionRepository.updateConnectionRequestStatus(
      connectionRequestId,
      status,
    );
  return updatedConnectionDetails;
};

module.exports = {
  createConnectionRequest,
  updateConnectionStatus,
};
