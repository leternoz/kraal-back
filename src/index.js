import { makeAugmentedSchema } from 'neo4j-graphql-js';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import neo4j from 'neo4j-driver';

import config from './config.js';
import typeDefs from './typedefs';
import resolvers from './resolvers';


// const schema = makeAugmentedSchema({ typeDefs });
const schema = makeAugmentedSchema({ typeDefs, resolvers });

const app = express();

const driver = neo4j.driver(
    config.neo4jHost,
    neo4j.auth.basic(config.neo4jUser, config.neo4jPassword)
);

const server = new ApolloServer({schema, context: {driver}});
server.applyMiddleware({ app });

app.listen(config.apolloListenningPort, () => {
    console.log('🚀Server ready at http://localhost:'+config.apolloListenningPort+"/graphql");
});