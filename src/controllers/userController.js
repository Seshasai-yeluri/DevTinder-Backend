const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  const userInfo = await userService.registerUser(req.body);

  if (userInfo) {
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userDetails: userInfo,
    });
  }
};

const loginUser = async (req, res) => {
  const userDetails = req.body;
  const userInfo = await userService.loginUser(userDetails);

  const token = jwt.sign(
    { id: userInfo._id, emailId: userInfo.emailId },
    process.env.SECRET_KEY,
    {
      expiresIn: "1d",
    },
  );

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    accessToken: token,
    userDetails: userInfo,
  });
};

const getUserProfile = async (req, res) => {
  const { id, emailId } = req.user;
  const userDetails = await userService.getUserProfile(id);
  if (!userDetails) {
    throw new APIError("User not found", 404);
  }
  return res.status(200).json({
    success: true,
    message: "User details found",
    userDetails: userDetails,
  });
};

const updateUser = async (req, res) => {
  const { id } = req.user;
  const updatedUserDetails = await userService.updateUser(id, req.body);
  if (!updatedUserDetails) {
    throw new APIError("User not found", 404);
  }
  return res.status(200).json({
    success: true,
    message: "User details updated successfully",
    userDetails: updatedUserDetails,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
};
