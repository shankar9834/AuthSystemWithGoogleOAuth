
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profileVisibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    }
});

module.exports = mongoose.model('User', userSchema);
