// const { CustomAPIError } = require("../errors/customErrors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong",
  };
  if (err.code && err.code === 11000) {
    customError = {
      statusCode: StatusCodes.CONFLICT,
      message: "Email already exists can't be used again!",
    };
  }
  if (err.name === "ValidationError") {
    customError = {
      statusCode: StatusCodes.BAD_REQUEST,
      message:
        err.message.split(":").reverse()[0] ||
        "Please provide correct details.",
    };
  }

  if (err.name === "CastError") {
    // console.log(err);
    customError = {
      statusCode: StatusCodes.BAD_REQUEST,
      message: "No Data Found",
    };
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ message: err.message });
  // }
  // return res.status(500).json({ message: err });
  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
};

module.exports = errorHandlerMiddleware;
