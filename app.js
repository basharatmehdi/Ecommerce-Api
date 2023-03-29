const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { notFound } = require("./middlewares/notFound");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
require("dotenv").config();
const app = express();

//other packages
const cors = require("cors");
const rateLimiter = require("express-rate-limiter");
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

// db connect
const dbConnect = require("./config/dbConnect");

// routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

//other middlewares
app.set("trust proxy", 1);
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// );

// middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  // console.log(req.cookies);
  console.log(req.signedCookies);
  res.json({
    message: "hello there this is a test now after a long time. again",
  });
});

//Route middleware
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const startApp = async () => {
  try {
    await dbConnect(process.env.MONGO_URL);
    app.listen(process.env.PORT, () => {
      console.log(`server has started on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startApp();
