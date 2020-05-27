const { makeAugmentedSchema } = require('neo4j-graphql-js');
const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const express = require('express');
const neo4j = require('neo4j-driver');

const config = require('./config.js');
const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');
const { getTokenFromReq } = require('./auth');

const schema = makeAugmentedSchema({ typeDefs, resolvers}); 

const app = express();

const driver = neo4j.driver(
    config.neo4jHost,
    neo4j.auth.basic(config.neo4jUser, config.neo4jPassword),
);

const server = new ApolloServer({schema, context: {getTokenFromReq, driver}});
server.applyMiddleware({ app });

app.listen(config.apolloListenningPort, () => {
    console.log('🚀Server ready at http://localhost:'+config.apolloListenningPort+"/graphql");
});