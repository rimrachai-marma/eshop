const jwt = require("jsonwebtoken");

const User = require("../models/user");
const ErrorResponse = require("../utilities/errorResponse");
const asyncHandler = require("../utilities/asyncHandler");

module.exports.auth = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.auth_token;

  if (!token) {
    throw new ErrorResponse("Not authorized, no token", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      tokens: { $in: [token] },
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    throw new ErrorResponse("Not authorized, token failed", 401);
  }
});

module.exports.admin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
    next();
  } else {
    throw new ErrorResponse("Access denied, not authorized as an admin", 401);
  }
};

module.exports.superadmin = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    next();
  } else {
    throw new ErrorResponse("Access denied, not authorized as an superadmin", 401);
  }
};
