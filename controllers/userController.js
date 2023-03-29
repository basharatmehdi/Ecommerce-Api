const User = require("../models/User");
const StatusCodes = require("http-status-codes");
const asyncWrapper = require("../middlewares/asyncWrapper");
const NewError = require("../errors");
const { createTokenUser } = require("../utils/createTokenUser");
const { attachCookiesResponse } = require("../utils/jwt");

//Get all Usersconst NewError = require("../errors");
const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(StatusCodes.OK).json({ users });
});

//Get single User
const getSingleUser = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  // const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    // return res
    //   .status(StatusCodes.NOT_FOUND)
    //   .json({ message: "User doesn't exist" });
    throw new NewError.NotFoundError("User doesn't exist");
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
});

//Show Current User
const showCurrentUser = asyncWrapper(async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
});

//Update User Details
const updateUser = asyncWrapper(async (req, res) => {
  // res.send("update user");
  const { name, email } = req.body;
  if (!name || !email) {
    throw new NewError.BadRequest("Please provide all values");
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { name, email },
    { new: true, runValidators: true }
  );
  const tokenUser = createTokenUser(user);
  attachCookiesResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
});

//Update User Role
const updateUserRole = async (req, res) => {
  res.send("update user");
};

//Update User Password
const updateUserPassword = asyncWrapper(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new NewError.BadRequest("Please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    throw new NewError.UnauthenticatedError("Invalid password");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ message: "Password has been updated" });
});

//Delete User
const deleteUser = async (req, res) => {
  res.send("delete user");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserRole,
  updateUserPassword,
  deleteUser,
};
