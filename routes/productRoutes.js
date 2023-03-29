const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");
const {
  authenticateUser,
  authorizeUser,
} = require("../middlewares/authentication");

const { getSingleProductReview } = require("../controllers/reviewController");

router.post(
  "/create-product",
  authenticateUser,
  authorizeUser("admin"),
  createProduct
);
router.get("/", getAllProducts);
router.post(
  "/upload-image",
  authenticateUser,
  authorizeUser("admin"),
  uploadImage
);
router.patch("/:id", authenticateUser, authorizeUser("admin"), updateProduct);
router.delete("/:id", authenticateUser, authorizeUser("admin"), deleteProduct);
router.get("/:id", getSingleProduct);

router.get("/:id/reviews", getSingleProductReview);

module.exports = router;
