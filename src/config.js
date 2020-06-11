
const config = {
    "neo4jHost": "bolt://localhost:7687",
    "neo4jUser": "neo4j",
    "neo4jPassword": "azerty",
    "apolloListenningPort": process.env.LISTENNING_PORT || 3003,
    // "tokenSecret": "a1cf4823e244c324b677aebd641c776c3ba14d04fc0bf41707bf8fc2aa20e0d7a23ae13ba360d8c2efaff1ec5bd0da01530b3c14362c4765e1b4df9ca018d284",
    "tokenSecret": process.env.JWT_SECRET,
    "tokenExpiresIn": '2h'
};

module.exports = config