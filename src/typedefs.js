import gql from 'graphql-tag';

// TODO mutation: signup, assign person to group

const typeDefs = gql`
    scalar Date

    type User {
        email: String!
        memberId: Int
        password: String
    }
    
    type Person {
        email: String!
        name: String
        surname: String
        adress: String
        city: City @relation(name: "LIVES_IN", direction:"OUT")
        birthDate: Date

        scout: [Scout]
        chief: [Chief]
        manager: [Manager]
        member: [Group] @relation(name: "MEMBER_IN", direction: "OUT")
    }

    type Unit {
        name: String
        creationDate: Date
        closureDate: Date
        scouts: [Scout]
        chiefs: [Chief]
    }

    type Group {
        name: String
        creationDate: Int
        closureDate: Int
        members: [Person] @relation(name: "MEMBER_IN", direction: "IN")
    }

    type Territory {
        name: String
        creationDate: Date
        closureDate: Date
    }

    type City {
        name: String
        code: Int
    }

    type Scout @relation(name: "IS_SCOUT_IN") {
        from: Person
        to: Unit
        year: Int
        startDate: Date
        endDate: Date
    }

    type Chief @relation(name: "IS_CHIEF_IN") {
        from: Person
        to: Unit
        chiefRoles: [ChiefRole]
        startDate: Date
        endDate: Date        
    }

    type Manager {
        from: Person
        to: Group
        role: String
        startDate: Date
        endDate: Date
    }

    enum ChiefRole {
        HEAD
        NURSE
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