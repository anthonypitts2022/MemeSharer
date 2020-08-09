const { logger } = require('../lib/logger.js')
const mongoose = require("mongoose");

module.exports = () => {
  const db = mongoose
    .connect(
      process.env.MEMESHARER_gateway_dbConnection,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
    )
    .then(() => logger.info("Mongoose connected!"))
    .catch(err => logger.error(`${err}`));
};
