let http = require('http');
let https = require('https');
const { logger } = require("app-root-path").require("/config/logger.js");
const fs = require("fs");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { corsConfig } = require("./cors.js");
const { ApolloServer, gql } = require("apollo-server-express");
const { buildFederatedSchema } = require("@apollo/federation");
const { createHttpLink } = require("apollo-link-http");
const { formatGQLError } = require("../lib/formatGQLError");
// the below will take all the schemas available and merge them
const { makeExecutableSchema } = require("graphql-tools");


//Create the master schema
const createSchema = async () => {
  // Bring in the local schema.
  const schemaFile = fs.readFileSync(
    __dirname + "/../app/graphql/schemas/posts-schema.graphql",
    {
      encoding: "utf8"
    }
  );
  const typeDefs = gql`
    ${schemaFile}
  `;

  // Bring in our local resolvers. The resolvers create our queries
  const resolvers = require("../app/graphql/resolvers/index.js");
  //Set up the local "proxy schema and resolver"
  const schema = buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]);

  return schema;
};

//Create the graphqlserver
const createServer = async app => {
  const path = "/posts";
  const schema = await createSchema();
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => {
      return {
        req,
        res
      };
    },
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
  logger.info(`🚀 posts graphql service ready at ${server.graphqlPath}`);


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

module.exports = { createSchema, createServer };
