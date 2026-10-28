const connectionModel = require("../models/ConnectionRequest");

const createConnectionRequest = async (fromUserId, connectionDetails) => {
  const details = new connectionModel({
    fromUserId,
    ...connectionDetails,
  });
  await details.save();

  await details.populate("fromUserId");
  await details.populate("toUserId");

  return details;
};

const findConnectionStatus = async (fromUserId, toUserId) => {
  const userDetails = await connectionModel.findOne({
    $or: [
      {
        fromUserId,
        toUserId,
      },
      {
        fromUserId: toUserId,
        toUserId: fromUserId,
      },
    ],
  });
  return userDetails || null;
};

const findConnectionRequestById = async (id) => {
  const connectionDetails = await connectionModel.findById(id);
  return connectionDetails || null;
};

const updateConnectionRequestStatus = async (connectionRequestId, status) => {
  const updatedConnectionRequestDetails =
    await connectionModel.findByIdAndUpdate(
      connectionRequestId,
      {
        $set: {
          status: status,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  return updatedConnectionRequestDetails || null;
};

module.exports = {
  createConnectionRequest,
  findConnectionStatus,
  findConnectionRequestById,
  updateConnectionRequestStatus,
};
