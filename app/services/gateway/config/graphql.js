let http = require('http');
let https = require('https');
const { logger } = require("app-root-path").require("/config/logger.js");
const { corsConfig } = require("./cors.js");
const { GatewayMicroServiceDataTransfer } = require("./GatewayDataTransfer.js");
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
      var env = process.env.NODE_ENV;
      var reqAuthToken = req.headers.authorization;
      var resAuthToken;
      return {
        req,
        res,
        reqAuthToken,
        resAuthToken,
        env
      };
    },
    plugins: [
      {
        requestDidStart() {
          return {
            willSendResponse({ context, response }) {
              // Append authToken from context to the outgoing client's response headers
              if(context && context.resAuthToken){
                response.http.headers.set('Authorization', context.resAuthToken);
                response.http.headers.set('Access-Control-Expose-Headers', 'Authorization');
              }
            }
          };
        }
      }
    ],
    subscriptions: false,
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
    let privateKey = fs.readFileSync(`${process.env.sslPrivateKeyFilePath}`, 'utf8');
    let certificate = fs.readFileSync(`${process.env.sslFullChainKeyFilePath}`, 'utf8');
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
