const getUserByEmail = (email) => {
    return `MATCH (user:User {email: "${email}"}) RETURN user;`;
};

const getUserByMemberId = (memberId) => {
    return `MATCH (user:User {memberId: "${memberId}"}) RETURN user;`;
};

const createUser = (user) => {
    return `CREATE (user:User {email: "${user.email}", memberId: ${user.memberId}, password: "${user.password}"}) RETURN user;`;
};

/**
 * Run the query in the neo4j database
 * @param {*} context 
 * @param {*} params 
 * @param {*} query, the cypher query
 */
const runQuery = async (context, params, query ) => {
    return context.driver.session().run(query, params);
};

/**
 * Return the first object from a neo4j query
 * @param {*} queryResult 
 */
const parseFirstResult = (queryResult) => {
    return queryResult.records[0]._fields[0].properties;
}

module.exports = { getUserByEmail, getUserByMemberId, createUser, runQuery, parseFirstResult };