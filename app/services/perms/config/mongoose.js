require("module-alias/register");
const { logger } = require("@lib/logger");
const config = require("./config");
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

module.exports = () => {
  const db = mongoose
    .connect(
      config.mongoURI,
      { useNewUrlParser: true, useCreateIndex: true }
    )
    .then(() => logger.info("Mongoose connected!"))
    .catch(err => logger.error(`${err}`));
};
