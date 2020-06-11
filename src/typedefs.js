const gql = require('graphql-tag');

const typeDefs = gql`
    scalar Date

    type User {
        email: String!
        memberId: Int 
        password: String
        roles: [Role]
        person: Person @relation(name: "CORRESPONDS_TO", direction: "OUT")
    }

    enum Role {
        ADMIN,
        MODERATOR,
        USER
    }
    
    type Person {
        email: String!
        name: String
        surname: String
        address: String
        city: City @relation(name: "LIVES_IN", direction:"OUT")
        dateOfBirth: Date
        phone: String
        secondPhone: String

        user: User @relation(name: "LINKED_TO", direction: "IN")
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

    type Manager @relation(name: "IS_MANAGER_IN") {
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

    input AuthenticationInput {
        login: String!
        password: String!
    }

    type AuthenticationResult {
        token: String
        message: String
    }

    input SignUpInput {
        email: String!
        memberId: Int 
        password: String!
    }

    type SignUpResult {
        token: String
        message: String
    }

    type Query {
        me: User
        getProfile(email: String): User
    }
 
    type Mutation {
        login(input: AuthenticationInput): AuthenticationResult
        signup(input: SignUpInput): SignUpResult
    }
`;

module.exports = typeDefs;