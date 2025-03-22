const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
    username: {
        type: String,
        trim: true,
        required: true,
        min:3,
        max:12,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min:3,
        max:12
    }
})

const User = mongoose.model('user', UserSchema)
module.exports = User;