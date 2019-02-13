const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema({
    longitude: Number,
    latitude: Number,
    title: String,
    image: String,
    content: String,
    comments: [{
        text: String,
        createdAt: { type: Date, default: Date.now },
        author: {
            type: mongoose.Schema.ObjectId, ref: "User"
        }
    }],
    author: { type: mongoose.Schema.ObjectId, ref: "User"},
},{
    timestamps: true
});

module.exports = mongoose.model("Pin", PinSchema);