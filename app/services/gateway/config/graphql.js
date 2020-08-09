let http = require('http');
let https = require('https');
const { logger } = require('../lib/logger.js')
const { corsConfig } = require("./cors.js");
const { GatewayMicroServiceDataTransfer } = require("./GatewayDataTransfer.js");
const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway } = require("@apollo/gateway");
const { formatGQLError } = require("../lib/formatGQLError");
const fs = require("fs");


const gateway = new ApolloGateway({
  serviceList: [
    {
      name: "user",
      url: `${process.env.userms_address}/user`
    },
    {
      name: "posts",
      url: `${process.env.postsms_address}/posts`
    },
    {
      name: "perms",
      url: `${process.env.permsms_address}/perms`
    },
    {
      name: "auth",
      url: `${process.env.authms_address}/auth`
    }
  ],
  buildService({ url }) {
    //handles transfering req/res objects between microservices and the gateway 
    return new GatewayMicroServiceDataTransfer({ url });
  }
});

//Create the graphqlserver
const createServer = async app => {
  const path = "/gateway";
  const { schema, executor } = await gateway.load();
  const server = new ApolloServer({
    schema,
    executor,
    context: ({ req, res }) => {
      return {
        req,
        res
      };
    },
    subscriptions: false,
    formatError: err => formatGQLError(err)
  });
  server.applyMiddleware({
    app,
    path,
    cors: corsConfig,
    tracing: true,
    cacheControl: {
      defaultMaxAge: 3500
    }
  });
  logger.info(`🚀 gateway graphql service ready at ${server.graphqlPath}`);

  //production https server
  if(process.env.NODE_ENV=="production"){
    //https certificate files
    var privateKey = fs.readFileSync(`${process.env.sslPrivateKeyFilePath}`, 'utf8');
    var certificate = fs.readFileSync(`${process.env.sslFullChainKeyFilePath}`, 'utf8');
    var credentials = {
    	key: privateKey,
    	cert: certificate
    };
    //return the https server entrance for SSL termination
    return await https.createServer(credentials, app)
  }
  //development http server
  else{
    //return the http server entrance
    return await http.createServer(app)
  }

};

module.exports = { createServer };
