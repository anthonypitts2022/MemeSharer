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
// the below will take all the schemas available and merge them
const { makeExecutableSchema } = require("graphql-tools");


//Create the master schema
const createSchema = async () => {
  // Bring in the local schema.
  const schemaFile = fs.readFileSync(
    __dirname + "/../app/graphql/schemas/perms-schema.graphql",
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
  const path = "/perms";
  const schema = await createSchema();
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => {
      // Set the current environment
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
    cors: corsConfig,
    tracing: true,
    cacheControl: {
      defaultMaxAge: 3500
    }
  });
  logger.info(`🚀 perms graphql service ready at ${server.graphqlPath}`);


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

module.exports = { createSchema, createServer };
