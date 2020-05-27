const { neo4jgraphql } = require('neo4j-graphql-js'); 

const { hashPassword, comparePassword, generateAccessToken } = require('./auth');
const { isValidEmail, isValidMemberId} = require('./validators');
const { getUserByEmail, getUserByMemberId, createUser, runQuery, parseFirstResult } = require('./databaseQueries');

const resolvers = {
    Query: {
        User: (root, params, context, info) => {
            return neo4jgraphql(root, params, context, info);
        }
    },
 
    Mutation: {
        login: async (root, args, context, info)  => {
            let cypherQuery;
            const { login, password } = args.input;
            if (isValidEmail(login)) {
                cypherQuery = getUserByEmail(login);
            } else if(isValidMemberId(login)) {
                cypherQuery = getUserByMemberId(login);
            } else {
                console.error(`The login is neither an email or a member id, value : ${login}`);
                return;
            }
            // TODO fix the way to fetch a user to make it cleaner
            // TODO check if the user exists
            // TODO catch the errors, is there a GraphQL way to do it ?
            const queryResult = await runQuery(context, null, cypherQuery );
            const userRetrieved = parseFirstResult(queryResult);
            const isCredentialsValid = await comparePassword(password, userRetrieved.password);
            return isCredentialsValid ? {token: generateAccessToken(userRetrieved), message: "user authenticated successfully"} : {token: null, message: "failed to authenticate"};
        },
        signup: async (root, args, context, info) => {
            const userToCreate = args.input;
            userToCreate.password = await hashPassword(userToCreate.password);
            const queryResult = await runQuery(context, null, createUser(userToCreate));
            return {token: generateAccessToken(userToCreate), message: "user created successfully"};
        }
    }
};

module.exports = resolvers;