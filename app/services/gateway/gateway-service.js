require('module-alias/register')
const rootPath = require('app-root-path')
const { logger } = require('@lib/logger.js')
const { createApolloFetch } = require('apollo-fetch');
const mongoose = require('./config/mongoose.js')
const express = require('./config/express.js')

const db = mongoose()
const port = process.env.gatewayms_port

let app_info = express();

app_info.then(function(app_info){
  app = app_info[0] //app is the return from express
  server = app_info[1] //server is the return from https.createServer(credentials, app)

  server.listen(port, () => logger.info(`Gateway service started on port ${port}`))

})
