require("module-alias/register");
const { httpLog } = require("@lib/logger");
const express = require("express");
const bodyParser = require("body-parser");
const { corsConfig } = require("./cors.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createServer } = require("./graphql.js");

module.exports = function() {
  const app = express();
  httpLog(app);
  app.use(cors(corsConfig));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  createServer(app);

  // initialize passport
  // app.use(passport.initialize());

  return app;
};
