process.env.NODE_ENV = process.env.NODE_ENV || "development";
const { logger } = require("app-root-path").require("/config/logger.js");
// const mongoose = require("./config/mongoose.js");
const express = require("./config/express");

// const db = mongoose();
const app = express();
const port = process.env.gatewayms_port

app.listen(port, () => logger.info(`gateway server running on port ${port}`));
