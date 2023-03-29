const NewError = require("../errors");
const { verifyToken } = require("../utils/jwt");

const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new NewError.UnauthenticatedError("Authentication Failed!");
  }
  try {
    const payload = verifyToken({ token });
    // console.log(payload);
    req.user = {
      name: payload.name,
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch (err) {
    throw new NewError.UnauthenticatedError("Authentication Failed!");
  }
};

const authorizeUser = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      throw new NewError.UnauthorizedError("Access Denied!");
    }
    // if (req.user.role === "admin" || req.user.role === "owner") {
    //   next();
    // } else {
    //   throw new NewError.UnauthorizedError("Access Denied!");
    // }
  };
};

module.exports = {
  authenticateUser,
  authorizeUser,
};
