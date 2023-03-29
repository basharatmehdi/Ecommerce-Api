const NewError = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin" || requestUser.role === "owner") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new NewError("You are not authorized to access this.");
};

module.exports = checkPermissions;
