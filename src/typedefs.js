import gql from 'graphql-tag';

// TODO extend the user type, for the scouts, the chiefs, the managers
// TODO mutation: signup, assign user

const typeDefs = gql`
    type User {
        id: ID!
        password: String
        email: String!
        memberId: Int
        name: String
        surname: String
        missions: [Mission]
    }

    type Unit {
        id: ID!
        name: String
    }

    type Mission {
        id: ID!
        unit: Unit!
        user: User!
        missionRole(role: Role): String
        startDate: String
        endDate: String
    }

    enum Role {
        SCOUT
        CHIEF
        MANAGER
        DELEGATE
    }

    type Query {
        users: [User]
        user(id: ID): User
        me: User
    }
 
    type Mutation {
        login(email: String, password: String): String
    }
`;

module.exports = typeDefs;