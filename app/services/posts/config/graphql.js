require("module-alias/register");
const { logger } = require("@lib/logger");const fs = require("fs");
const config = require("./config");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { corsConfig } = require("./cors.js");

// Set the environment
process.env.NODE_ENV = process.env.NODE_ENV || "development";

// Gets the token and decodes that payload
const getUser = token => {
  try {
    if (token) {
      return jwt.verify(token, config.jwtSecretKey);
    }
    return null;
  } catch (err) {
    return null;
  }
};

// const graphqlExpress = require("express-graphql");
const { ApolloServer } = require("apollo-server-express");
// const { graphqlExpress } = require("apollo-server-express");

// the below will take all the schemas available and merge them
const {
  makeExecutableSchema,
  mergeSchemas,
  makeRemoteExecutableSchema,
  introspectSchema
} = require("graphql-tools");


//Create the master schema
const createSchema = async () => {
  // Bring in the local schema. Our schemas define our data
  const typeDefs = fs.readFileSync(
    __dirname + "/../app/graphql/schemas/posts-schema.graphql",
    {
      encoding: "utf8"
    }
  );
  // Bring in our local resolvers. The resolvers create our queries
  const resolvers = require("../app/graphql/resolvers/index.js");

  //Set up the local "proxy schema and resolver"
  const localSchema = makeExecutableSchema({
    typeDefs,
    resolvers
  });
  return localSchema;
};
//Create the graphqlserver
const createServer = async app => {
  const path = "/posts";
  const schema = await createSchema();
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => {
      // Set the current environment
      const env = process.env.NODE_ENV;

      // Get the user token from cookies
      const jwtToken = req.cookies.Auth ? req.cookies.Auth.jwtToken : "";

      // Only set a tester token if the environment is in development
      // This will be used by jest tester
      const testerToken = env == "development" ? req.headers.authorization : "";

      // Set the token
      const tokenWithBearer = jwtToken || testerToken || "";
      const token = tokenWithBearer.split(" ")[1];

      // Set the user information based on the token
      // we will decrypt the jwt token and get the contents
      var user = getUser(token);
      if(user==null){
        user = {
          id: "123"
        };
      }

      return {
        req,
        res,
        user,
        env
      };
    }
  });
  server.applyMiddleware({
    app,
    path,
    cors: corsConfig
  });
  logger.info(`🚀 posts graphql service ready at ${server.graphqlPath}`);
};

module.exports = { createSchema, createServer };
