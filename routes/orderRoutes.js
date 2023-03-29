const express = require("express");
const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const {
  authenticateUser,
  authorizeUser,
} = require("../middlewares/authentication");
const router = express.Router();

router.post("/create-order", authenticateUser, createOrder);
router.get("/", authenticateUser, authorizeUser("admin"), getAllOrders);
router.get("/my-orders", authenticateUser, getCurrentUserOrders);
router.delete("/:id", authenticateUser, deleteOrder);
router.patch("/:id", authenticateUser, updateOrder);
router.get("/:id", authenticateUser, getSingleOrder);

module.exports = router;
