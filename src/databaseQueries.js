const getUserByEmail = (email) => {
    return `MATCH (user:User {email: "${email}"}) RETURN user;`;
};

const getUserByMemberId = (memberId) => {
    return `MATCH (user:User {memberId: "${memberId}"}) RETURN user;`;
};

const createUser = (user) => {
    return `CREATE (user:User {email: "${user.email}", memberId: ${user.memberId}, password: "${user.password}"}) RETURN user;`;
};

const getProfile = (email) => {
    return `MATCH path = (user:User {email: "${email}"}) - [:CORRESPONDS_TO] -> (person:Person) - [:LIVES_IN] -> (city:City) RETURN user, person, city`;
}

/**
 * Return the first object from a neo4j query
 * @param {*} queryResult 
 */
const parseFirstResult = (queryResult) => {
    return (queryResult.records.length && queryResult.records[0]._fields[0].properties) || null;
}

module.exports = { 
    getUserByEmail, 
    getUserByMemberId,
    getProfile, 
    createUser, 
    parseFirstResult
};