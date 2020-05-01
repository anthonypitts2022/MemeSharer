let http = require('http');
let https = require('https');
const { logger } = require("app-root-path").require("/config/logger.js");
const { corsConfig } = require("./cors.js");
const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway } = require("@apollo/gateway");
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
    }
  ]
});

//Create the graphqlserver
const createServer = async app => {
  const path = "/gateway";
  const { schema, executor } = await gateway.load();
  const server = new ApolloServer({
    schema,
    executor,
    context: ({ req, res }) => {
      const env = process.env.NODE_ENV;
      return {
        req,
        res,
        env
      };
    },
    formatError: err => {
      return { message: err.message };
    }
  });
  server.applyMiddleware({
    app,
    path,
    tracing: true,
    cacheControl: {
      defaultMaxAge: 3500
    }
  });
  logger.info(`🚀 gateway graphql service ready at ${server.graphqlPath}`);

  //production https server
  if(process.env.NODE_ENV=="production"){
    //https certificate files
    let privateKey = fs.readFileSync(process.env.privateKeyFilePath, 'utf8');
    let certificate = fs.readFileSync(process.env.fullChainKeyFilePath, 'utf8');
    let credentials = {
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
