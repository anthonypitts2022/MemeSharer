require("module-alias/register");
const { logger } = require("@lib/logger");
require("module-alias/register");
const config = require("./config");
const mongoose = require("mongoose");

module.exports = () => {
  const db = mongoose
    .connect(
      config.mongoURI,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
    )
    .then(() => logger.info("Mongoose connected!"))
    .catch(err => logger.error(`${err}`));
};
