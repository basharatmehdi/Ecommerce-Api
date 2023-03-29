const { StatusCodes } = require("http-status-codes");
const NewError = require("../errors");
const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/User");
const { createTokenUser } = require("../utils/createTokenUser");
const { attachCookiesResponse } = require("../utils/jwt");

//Register User
const register = asyncWrapper(async (req, res, next) => {
  const { email, password, name } = req.body;
  // const userExist = await User.findOne({ email: email });
  const firstUserAccount = (await User.countDocuments({})) === 0;
  const role = firstUserAccount ? "owner" : "user";
  // if (!userExist) {
  const user = await User.create({ email, name, password, role });
  const tokenUser = createTokenUser(user);
  attachCookiesResponse({ res, user: tokenUser });
  return res
    .status(StatusCodes.CREATED)
    .json({ user: tokenUser, message: "User successfully registered" });
  // }
  // return next(newError("User already exists", 400));
});

// Login user
const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (!password || !email) {
    throw new NewError.BadRequest("Email and Password are required");
  }
  if (!userExist) {
    throw new NewError.BadRequest("Invalid Credentials");
  }
  if (userExist && (await userExist.comparePassword(password))) {
    // const { password, ...restUserData } = userExist._doc;
    const tokenUser = createTokenUser(userExist);
    attachCookiesResponse({ res, user: tokenUser });
    return res
      .status(StatusCodes.OK)
      .json({ user: tokenUser, message: "Logged in successfully" });
  } else {
    throw new NewError.BadRequest("Invalid Credentials");
  }
});

//Logout user
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
};

module.exports = {
  register,
  login,
  logout,
};
