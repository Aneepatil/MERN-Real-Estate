export const globleErrorHandler = (error, req, res, next) => {
  const stack = error.stack;
  const message = error.message || "Internal Server Error";
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({ success: false, statusCode, message, stack });
};
