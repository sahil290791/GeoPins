const { AuthenticationError } = require("apollo-server");

const authenticated = (next) => (root, args, ctx, info) => {
    console.error('ctx', ctx);
    if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged-in');
    }
    return next(root, args, ctx);
};

module.exports = {
    Query: {
        me: authenticated((root, args, ctx) => ctx.currentUser)
    }
};