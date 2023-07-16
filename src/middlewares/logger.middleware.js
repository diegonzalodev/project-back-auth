const { devLogger, prodLogger } = require("../config/logger");

const loggerMidd = (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    req.logger = prodLogger;
  } else {
    req.logger = devLogger;
  }
  req.logger.info(
    `${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};

module.exports = loggerMidd;
