const express = require("express");
const bodyParser = require("body-parser");
const { corsConfig } = require("./cors.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createServer } = require("./graphql.js");
const { httpLog } = require("./logger.js");


module.exports = async function() {
  const app = express();
  httpLog(app);
  app.use(cors(corsConfig));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  let newServer = await createServer(app);


  return await [app, newServer];
};
