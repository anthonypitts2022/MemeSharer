process.env.NODE_ENV = process.NODE_ENV || "development";
const rootPath = require("app-root-path");
require("module-alias/register");
const { logger } = require("@lib/logger.js");
const mongoose = require("./config/mongoose.js");
const express = require("./config/express.js");

const db = mongoose();
const app = express();
const port = process.env.PORT || 3300;

app.listen(port, () => logger.info(`perms service started on port ${port}`));
