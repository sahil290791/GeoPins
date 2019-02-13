const User = require('../models/User.js');

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async (token) => {
    // verify the authToken
    const googleUser = await verifyToken(token);
    console.log('googleUser', googleUser);
    const user = await checkIfUserExists(googleUser.email);

    return user ? user : createNewUser(googleUser);
};

const verifyToken = async (token) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_CLIENT_ID
        });
        if (ticket) {
            return ticket.getPayload();
        }
    } catch(err) {
        console.error("Error verifying user ", err);
    }
};

const checkIfUserExists = async (email) => {
    try {
        const user = await User.findOne({ email }).exec();
        console.log('check ', user);
        return user;
    } catch(err) {
        console.error('check failed ', err);
    }
};

const createNewUser = async (googleUser) => {
    const { name, email, picture } = googleUser;
    const user = { name, email, picture };
    console.log('here');
    const newUser = await new User(user).save();
    console.log('newUser', newUser);
    return newUser;
};