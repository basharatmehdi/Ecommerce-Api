const express = require("express");
const {
  authenticateUser,
  authorizeUser,
} = require("../middlewares/authentication");
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserRole,
  updateUserPassword,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", authenticateUser, authorizeUser("owner", "admin"), getAllUsers);
router.get("/current-user", authenticateUser, showCurrentUser);
router.patch("/update-user", authenticateUser, updateUser);
router.patch(
  "/update-user-role",
  authenticateUser,
  authorizeUser("owner"),
  updateUserRole
);
router.patch("/update-password", authenticateUser, updateUserPassword);
router.delete("/delete-user", deleteUser);
router.get("/:id", authenticateUser, getSingleUser);

module.exports = router;
