const BadRequest = require("./badRequest");
const NotFoundError = require("./notFoundError");
const customAPIError = require("./customErrors");
const UnauthenticatedError = require("./unauthenticated");
const UnauthorizedError = require("./unauthorized");

module.exports = {
  BadRequest,
  NotFoundError,
  customAPIError,
  UnauthenticatedError,
  UnauthorizedError,
};
