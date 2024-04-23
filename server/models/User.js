const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // country: {
    //     type: String,
    // },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    token: {
        type: String
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;