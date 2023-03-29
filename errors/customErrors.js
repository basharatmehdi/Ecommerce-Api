class CustomAPIError extends Error {
  constructor(message) {
    super(message);
    // this.statusCode = statusCode;
  }
}
// const newError = (message, statusCode) => {
//   return new CustomAPIError(message, statusCode);
// };

module.exports = { CustomAPIError };
