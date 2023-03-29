const { StatusCodes } = require("http-status-codes");
const NewError = require("../errors");
const Product = require("../models/Product");
const Order = require("../models/Order");
const checkPermissions = require("../utils/checkPermissions");
const asyncWrapper = require("../middlewares/asyncWrapper");

//StripeAPI function
const stripeAPI = async ({ amount, currency }) => {
  const client_secret = "some_secret";
  return { client_secret, amount };
};

//Create Order
const createOrder = asyncWrapper(async (req, res) => {
  const { items: cartItems, tax, shipping } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new NewError.BadRequest("No cart items");
  }
  if (!shipping || !tax) {
    throw new NewError.BadRequest("Please provide shipping and tax");
  }
  let orderItems = [];
  let subtotal = 0;
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new NewError.NotFoundError("Product not found");
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    //add items to order
    orderItems = [...orderItems, singleOrderItem];
    //calculate subtotal
    subtotal += item.amount * price;
  }
  const total = subtotal + shipping + tax;
  //Get Client Secret
  const paymentIntent = await stripeAPI({
    amount: total,
    currency: "RS",
  });

  //Create Order
  const newOrder = await Order.create({
    cartItems: orderItems,
    shipping,
    tax,
    total,
    subtotal,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  res
    .status(StatusCodes.CREATED)
    .send({ order: newOrder, clientSecret: newOrder.clientSecret });
});

//Get All Orders
const getAllOrders = asyncWrapper(async (req, res) => {
  const orders = await Order.find({});
  if (!orders) {
    throw new NewError.NotFoundError("No orders found");
  }
  res.status(StatusCodes.OK).json({ orders });
});

//Get Single Order
const getSingleOrder = asyncWrapper(async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new NewError.NotFoundError("Order not found");
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
});

//Get Current Order
const getCurrentUserOrders = asyncWrapper(async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  if (!orders) {
    throw new NewError.NotFoundError("No orders found");
  }
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
});

//Update Order
const updateOrder = asyncWrapper(async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new NewError.NotFoundError("Order not found");
  }
  checkPermissions(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  // const { items: cartItems, shipping, tax } = req.body;
  // if (!cartItems || cartItems.length < 1) {
  //   throw new NewError.BadRequest("No cart items");
  // }
  // if (!shipping || !tax) {
  //   throw new NewError.BadRequest("Please provide shipping and tax");
  // }
  await order.save();
  res.status(StatusCodes.OK).json({ order });
});

//Delete Order
const deleteOrder = asyncWrapper(async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new NewError.NotFoundError("Order not found");
  }
  await order.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Order has been deleted." });
});

module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
  deleteOrder,
};
