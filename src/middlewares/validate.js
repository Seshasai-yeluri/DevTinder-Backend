const APIError = require("../utils/APIError");

const validate = (schema, property) => {
  return (req, res, next) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      return next(
        new APIError("Request Validation failed", 400, result.error.issues),
      );
    }
    req[property] = result.data;
    next();
  };
};

module.exports = validate;
