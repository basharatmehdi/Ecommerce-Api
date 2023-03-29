const express = require("express");
const {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  getSingleReview,
} = require("../controllers/reviewController");
const { authenticateUser } = require("../middlewares/authentication");
const router = express.Router();

router.post("/create-review", authenticateUser, createReview);
router.get("/", getAllReviews);
router.delete("/:id", authenticateUser, deleteReview);
router.patch("/:id", authenticateUser, updateReview);
router.get("/:id", getSingleReview);

module.exports = router;
