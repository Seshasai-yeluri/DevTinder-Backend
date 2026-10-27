const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userValidation = require("../validators/userValidators");
const validate = require("../middlewares/validate");
const { authenticateAccessToken } = require("../middlewares/auth");

router.post(
  "/register",
  validate(userValidation.registerUserSchema, "body"),
  userController.registerUser,
);

router.post(
  "/login",
  validate(userValidation.loginUserSchema, "body"),
  userController.loginUser,
);

router.get("/profile", authenticateAccessToken, userController.getUserProfile);

router.patch(
  "/updateProfile",
  authenticateAccessToken,
  validate(userValidation.updateUserSchema, "body"),
  userController.updateUser,
);

module.exports = router;
