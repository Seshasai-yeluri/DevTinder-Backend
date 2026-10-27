const jwt = require("jsonwebtoken");
const APIError = require("../utils/APIError");

const authenticateAccessToken = async (req, res, next) => {
  const authorization = req?.headers?.authorization;

  if (!authorization) {
    throw new APIError("Please login!!", 401);
  }

  const [scheme, accessToken] = authorization.split(" ");

  if (scheme !== "Bearer" || !accessToken) {
    throw new APIError("Invalid authorization format", 401);
  }

  let decode;

  try {
    decode = jwt.verify(accessToken, process.env.SECRET_KEY);
  } catch (err) {
    throw new APIError("Please login!!!", 401);
  }

  req.user = {
    id: decode.id,
    emailId: decode.emailId,
  };

  return next();
};

module.exports = {
  authenticateAccessToken,
};
