const jwt = require("jsonwebtoken");

const createToken = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};

const verifyToken = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesResponse = ({ res, user }) => {
  const token = createToken({ payload: user });
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = {
  createToken,
  verifyToken,
  attachCookiesResponse,
};
