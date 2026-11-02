const userModel = require("../models/User");

const createUser = async (userDetails) => {
  const userInfo = new userModel({
    ...userDetails,
  });
  await userInfo.save();
  return userInfo;
};

const findAllUsers = async (id, connectionDetailsToIds, skip, limit) => {
  const usersDetails = await userModel
    .find({
      _id: { $nin: [id, ...connectionDetailsToIds] },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  return usersDetails;
};

const findUserByEmail = async (emailId) => {
  const userInfo = await userModel.findOne({
    emailId: emailId,
  });
  return userInfo || null;
};

const findUserById = async (id) => {
  const userInfo = await userModel.findById(id);
  return userInfo || null;
};

const findUserByEmailForAuthentication = async (emailId) => {
  const userInfo = await userModel.findOne({ emailId }).select("+password");
  return userInfo || null;
};

const updateUserById = async (id, updateData) => {
  const updatedInfo = await userModel.findByIdAndUpdate(
    id,
    {
      $set: {
        ...updateData,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return updatedInfo || null;
};

const deleteUserById = async (id) => {
  const deletedUser = await userModel.findByIdAndDelete(id);
  return deletedUser || null;
};

module.exports = {
  createUser,
  findAllUsers,
  findUserByEmail,
  findUserById,
  findUserByEmailForAuthentication,
  updateUserById,
  deleteUserById,
};
