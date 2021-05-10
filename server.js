const { ApolloServer } = require("apollo-server");
const cors = require('cors');
const typeDefs = require('./typeDefs.js');
const resolvers = require('./resolvers.js');
const mongoose = require('mongoose');
require('dotenv').config();
const { findOrCreateUser } = require('./controllers/userController.js');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('DB Connected successfully'))
.catch(err => console.error(err));


const server = new ApolloServer({
    cors: true,
    typeDefs,
    resolvers,
    // introspection: true,
    // playground: true,
    context: async ({ req }) => {
        let authToken = null;
        let currentUser = null;
        try {
            authToken = req.headers.authorization;
            if (authToken) {
                currentUser = await findOrCreateUser(authToken);
                console.log('current user', currentUser);
            }
        } catch (err) {
            console.error(`Unable to authenticate user with token ${authToken}`);
        }
        return { currentUser };
    }
});

server.listen({ port: process.env.PORT || 4000 }).then(( {url} ) => {
    console.log(`
        Server is running!
        Listening on port ${process.env.PORT || 4000 }
        Explore at https://studio.apollographql.com/dev
    `, url);
});