const userRepository = require("../repositories/userRepository");
const APIError = require("../utils/APIError");
const bcrypt = require("bcrypt");

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
  getUserProfile,
  updateUser,
  deleteUser,
};
