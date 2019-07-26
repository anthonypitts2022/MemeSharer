process.env.NODE_ENV = process.NODE_ENV || "development";
require("module-alias/register");
const rootPath = require("app-root-path");
const { logger } = require("@lib/logger.js");

const mongoose = require("./config/mongoose.js");
const express = require("./config/express.js");

const db = mongoose();
const app = express();
const port = process.env.PORT || 3302;

app.listen(port, () => logger.info(`User service started on port ${port}`));
