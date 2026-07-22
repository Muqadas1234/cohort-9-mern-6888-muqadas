const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  const statusCode =
    Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode < 500
      ? err.statusCode
      : 500;

  res.status(statusCode).json({
    message: statusCode === 500 ? 'Something went wrong on the server' : err.message,
  });
};

module.exports = errorHandler;