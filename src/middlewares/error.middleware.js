const { EErrors } = require("../utils/CustomError/EErrors");

exports.errorHandler = (error, req, res, next) => {
  console.log(error.cause);
  switch (error.code) {
    case EErrors.INVALID_TYPE_ERROR:
      return res.send({ status: "error", error: error.name });
      break;
    default:
      return res.send({ status: "error", error: "Unhandled error" });
      break;
  }
};
