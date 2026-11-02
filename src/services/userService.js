const userRepository = require("../repositories/userRepository");
const APIError = require("../utils/APIError");
const bcrypt = require("bcrypt");
const connectionRepository = require("../repositories/connectionRepository");
const { redisClient } = require("../utils/redis");
const emailQueue = require("../queues/emailQueue");

const registerUser = async (userDetails) => {
  const { emailId, password } = userDetails;
  const userInfo = await userRepository.findUserByEmail(emailId);

  if (userInfo) {
    throw new APIError("Email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = await userRepository.createUser({
    ...userDetails,
    password: hashedPassword,
  });

  await emailQueue.add("sendWelcomeEmail", {
    fullName: `${createdUser.firstName} ${createdUser.lastName}`,
    emailId: createdUser.emailId,
  });

  const removePassword = createdUser.toObject();

  delete removePassword.password;

  return removePassword;
};

const loginUser = async (userDetails) => {
  const { emailId, password } = userDetails;

  const userInfo =
    await userRepository.findUserByEmailForAuthentication(emailId);

  if (!userInfo) {
    throw new APIError("Please enter valid credentials", 401);
  }
  const passwordInDB = userInfo.password;

  const isMatched = await bcrypt.compare(password, passwordInDB);

  if (!isMatched) {
    throw new APIError("Please enter valid credentials!!", 401);
  }
  const removePassword = userInfo.toObject();

  delete removePassword.password;

  return removePassword;
};

const getAllProfiles = async (id, queryDetails) => {
  const page = queryDetails?.page;
  const limit = queryDetails?.limit;
  const skip = (page - 1) * limit;

  const cacheKey = `feed:${id}:page:${page}:limit:${limit}`;

  let cachedData = null;

  try {
    cachedData = await redisClient.get(cacheKey);
  } catch (error) {
    console.error("Redis cache read failed:", error.message);
  }

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const connectionDetails = await connectionRepository.findAllUsers(id);
  const connectionDetailsToIds = connectionDetails.map((user) =>
    String(id) === String(user.toUserId) ? user.fromUserId : user.toUserId,
  );
  const usersDetails = await userRepository.findAllUsers(
    id,
    connectionDetailsToIds,
    skip,
    limit,
  );

  try {
    await redisClient.set(cacheKey, JSON.stringify(usersDetails), {
      EX: 300,
    });
  } catch (err) {
    console.log("Redis cache write failed:", err.message);
  }

  return usersDetails;
};

const getUserProfile = async (id) => {
  const userDetails = await userRepository.findUserById(id);
  return userDetails;
};

const updateUser = async (id, updateData) => {
  const updatedUserDetails = await userRepository.updateUserById(
    id,
    updateData,
  );
  return updatedUserDetails;
};

const deleteUser = async (id) => {
  const deletedUserDetails = await userRepository.deleteUserById(id);
  return deletedUserDetails;
};

module.exports = {
  registerUser,
  loginUser,
  getAllProfiles,
  getUserProfile,
  updateUser,
  deleteUser,
};
