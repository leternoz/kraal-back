const { neo4jgraphql } = require('neo4j-graphql-js'); 

const { ApolloError, UserInputError, AuthenticationError } = require('apollo-server');

const { hashPassword, comparePassword, generateAccessToken } = require('./auth');
const { errorCodes } = require('./errorHanling');
const { isValidEmail, isValidMemberId} = require('./validators');
const { getUserByEmail, getUserByMemberId, getProfile, createUser, parseFirstResult } = require('./databaseQueries');

const resolvers = {
    Query: {
        getProfile: (_, args, context, __) => {
            const user = context.user;
            // if(user === null) {
                // throw new AuthenticationError('The user is not authenticated');
                // }
                // const cypherQuery = getProfile(user.email); 
            // TODO add the date to the result   
            // const cypherQuery = getProfile(args.email); // TEST
            const cypherQuery = getProfile(user.email);
            const session = context.driver.session();
            return session.run(cypherQuery, null)
            .then( result => {
                const record = result.records[0];
                // TODO handle when no result
                // Note:  there there are no city associated, then no result
                if(record) {
                    const user = record.get('user').properties;
                    const person = record.get('person').properties;
                    const city = record.get('city').properties;
                    return {
                        id: user.id,
                        email: user.email,
                        memberId: user.memberId.low,
                        person: {
                            id: person.id,
                            email: person.email,
                            name: person.name,
                            surname: person.surname,
                            address: person.address,
                            phone: person.phone,
                            secondPhone: person.secondPhone,
                            dateOfBirth: {
                                year: person.dateOfBirth.year.low,
                                month: person.dateOfBirth.month.low,
                                day: person.dateOfBirth.day.low
                            },
                            city: {
                                id: city.id,
                                name: city.name,
                                code: city.code
                            }
                        }
                    };
                }
                return null;
            })
            .catch(e => {
                console.error(e);
                throw new Error('INTERNAL_SERVER_ERROR');
            })
            .finally(() => session.close());
        }
    },
 
    Mutation: {
        login: (_, args, context, __)  => {
            let cypherQuery;
            const { login, password } = args.input;
            if (isValidEmail(login)) {
                cypherQuery = getUserByEmail(login);
            } else if(isValidMemberId(login)) {
                cypherQuery = getUserByMemberId(login);
            } else {
                throw new UserInputError(`The login is neither an email or a member id, value : ${login}`);
            }
            const session = context.driver.session();
            return session.run(cypherQuery, null)
            .then(async result => {
                const userRetrieved = parseFirstResult(result);
                if(!userRetrieved){
                    const err = new ApolloError(errorCodes.FAILED_LOGIN.message, errorCodes.FAILED_LOGIN.code);
                    console.error(err)
                    throw new err;
                }
                const isCredentialsValid = await comparePassword(password, userRetrieved.password);
                if(!isCredentialsValid) {
                    const err = new ApolloError(errorCodes.FAILED_LOGIN.message, errorCodes.FAILED_LOGIN.code);
                    console.error(err)
                    throw err;
                }
                const payload = {
                    user: {
                        id: userRetrieved.id,
                        email: userRetrieved.email,
                        memberId: userRetrieved.memberId
                    }
                };
                return {token: generateAccessToken(payload), message: "user authenticated successfully"};
            })
            .finally(() => session.close());


        },
        signup: async (_, args, context, info) => {
            // TODO send email to confirm
            const session = context.driver.session();
            const userToCreate = args.input;
            userToCreate.password = await hashPassword(userToCreate.password);
            const cypherQuery = createUser(userToCreate);
            return session.run(cypherQuery, null)
                .then(result => {
                    const userCreated = result.records[0].get('user').properties;
                    const payload = {
                        user: {
                            id: userCreated.id,
                            email: userCreated.email,
                            memberId: userCreated.memberId
                        }
                    };
                    return {token: generateAccessToken(payload), message: "user created successfully"};
                })
                .catch(e => {
                    console.error(e);
                    throw new Error('INTERNAL_SERVER_ERROR');
                })
                .finally(() => session.close());

        }
    }
};

module.exports = resolvers;