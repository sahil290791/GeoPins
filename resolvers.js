const { AuthenticationError } = require("apollo-server");
const Pin = require('./models/Pin');

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
    },
    Mutation: {
        createPin: authenticated(async (root, args, ctx) => {
            const newPin = await new Pin({
                ...args.input,
                author: ctx.currentUser.id
            }).save();
            const pinAddeed = await Pin.populate(newPin, "author");
            return pinAddeed;
        })
    }
};