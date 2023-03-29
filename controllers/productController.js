const asyncWrapper = require("../middlewares/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const path = require("path");
const NewError = require("../errors");
const Product = require("../models/Product");

//Create Product
const createProduct = asyncWrapper(async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product, message: "Product created" });
});

//Get All Products
const getAllProducts = asyncWrapper(async (req, res) => {
  const products = await Product.find();
  res.status(StatusCodes.OK).json({ products });
});

//Get Single Product
const getSingleProduct = asyncWrapper(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate("reviews");
  if (!product) {
    throw new NewError.NotFoundError("Product not found");
  }
  res.status(StatusCodes.OK).json({ product });
});

//Update Product
const updateProduct = asyncWrapper(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new NewError.NotFoundError("Product not found");
  }
  res.status(StatusCodes.OK).json({ product, message: "Product updated" });
});

//Delete Product
const deleteProduct = asyncWrapper(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NewError.NotFoundError("Product not found");
  }
  await product.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Product has been removed" });
});

//Upload Product Image
const uploadImage = asyncWrapper(async (req, res) => {
  if (!req.files) {
    throw new NewError.BadRequest("No files to upload");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new NewError.BadRequest("No image to upload");
  }
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new NewError.BadRequest(
      "Image is too large. Image size should be less than 1MB"
    );
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ message: "Image uploaded" });
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
