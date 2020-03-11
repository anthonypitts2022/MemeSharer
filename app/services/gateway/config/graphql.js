const { logger } = require("app-root-path").require("/config/logger.js");
const { corsConfig } = require("./cors.js");
const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway } = require("@apollo/gateway");


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
    cors: corsConfig,
    tracing: true,
    cacheControl: {
      defaultMaxAge: 3500
    }
  });
  logger.info(`🚀 gateway graphql service ready at ${server.graphqlPath}`);
};

module.exports = { createServer };
