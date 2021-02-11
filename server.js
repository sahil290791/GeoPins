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


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://140369:<password>@cluster0.2wnmw.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
// client.connect(err => {
//     console.log('connected');
//     //   const collection = client.db("test").collection("test");
//     if (err) {
//         console.error(err);
//     }
//     // perform actions on the collection object
//     client.close();
// });


const server = new ApolloServer({
    cors: true,
    typeDefs,
    resolvers,
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

// server.applyMiddleware({ cors: false });

server.listen().then(( {url} ) => {
    console.log(`
        Server is running!
        Listening on port 4000
        Explore at https://studio.apollographql.com/dev
    `, url);
});