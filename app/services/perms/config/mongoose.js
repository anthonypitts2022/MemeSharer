require("module-alias/register");
const { logger } = require("@lib/logger");
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

module.exports = () => {
  const db = mongoose
    .connect(
      process.env.MEMESHARER_perms_dbConnection,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
    )
    .then(() => logger.info("Mongoose connected!"))
    .catch(err => logger.error(`${err}`));
};
