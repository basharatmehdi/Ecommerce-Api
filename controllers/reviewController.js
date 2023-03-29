const { StatusCodes } = require("http-status-codes");
const NewError = require("../errors");
const asyncWrapper = require("../middlewares/asyncWrapper");
const Product = require("../models/Product");
const Review = require("../models/Review");
const checkPermissions = require("../utils/checkPermissions");

//Create Review
const createReview = asyncWrapper(async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new NewError.NotFoundError("Product does not exist");
  }
  const alreadyExists = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  // console.log(alreadyExists, req.user.userId, productId);
  if (alreadyExists) {
    throw new NewError.BadRequest("Review already submitted for this product");
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ review, message: "Review Submitted." });
});

//Get All Reviews
const getAllReviews = asyncWrapper(async (req, res) => {
  const reviews = await Review.find()
    .populate({
      path: "product",
      select: "name brand price",
    })
    .populate({ path: "user", select: "name" });
  if (!reviews) {
    throw new NewError.NotFoundError("No reviews found");
  }
  res.status(StatusCodes.OK).json({ reviews });
});

//Get Single Review
const getSingleReview = asyncWrapper(async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new NewError.NotFoundError("Review not found");
  }
  res.status(StatusCodes.OK).json({ review });
});

//Update Review
const updateReview = asyncWrapper(async (req, res) => {
  const { id: reviewId } = req.params;
  const { title, rating, review: reviewText } = req.body;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NewError.NotFoundError("Review not found");
  }
  checkPermissions(req.user, review.user);
  review.title = title;
  review.rating = rating;
  review.review = reviewText;
  await review.save();
  res.status(StatusCodes.OK).json({ review, message: "Review Updated." });
});

//Delete Review
const deleteReview = asyncWrapper(async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new NewError.NotFoundError("Review not found");
  }
  checkPermissions(req.user, review.user);
  await review.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Review Deleted." });
});

const getSingleProductReview = asyncWrapper(async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  if (!reviews) {
    throw new NewError.NotFoundError("No reviews found");
  }
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
});

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReview,
};
