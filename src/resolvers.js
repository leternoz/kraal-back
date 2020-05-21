const resolvers = {
    Query: {
        users: (obj, args, context, info) => {
            return [];
        },
        user: (obj, args, context, info) => {
            return null;
        },
        me: (obj, args, context, info) => {
            return null;
        }
    },
 
    Mutation: {
        login: (obj, args, context, info) => {
            return "";
        }
    }
};

module.export = resolvers;