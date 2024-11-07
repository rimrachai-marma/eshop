const ErrorResponse = require("../utilities/errorResponse");

module.exports.notFound = (req, res, next) => {
  const error = new ErrorResponse(`Not Found - ${req.originalUrl}`, 404);

  next(error);
};

module.exports.errorHandler = (err, req, res, next) => {
  // console.log("Check error: ", err);

  let statusCode = err?.statusCode ?? 500;
  let message = err?.message ?? "Somthing went wrong";
  let extrafield = err?.extrafield ?? null;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  if (err && err._message?.includes("validation failed")) {
    const errors = new Object();

    Object.values(err.errors).forEach((error) => {
      errors[error.path] = error.properties.message;
    });

    statusCode = 400;
    message = err._message;
    extrafield = { errors };
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Resource already exists";
  }

  res.status(statusCode).json({
    status: "failed",
    message,
    extrafield,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
