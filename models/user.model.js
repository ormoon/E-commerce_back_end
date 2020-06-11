const mongoose = require('mongoose');
var schema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true,
        required: [true, "username shouldn't be empty"],
        lowercase: true,
        trim: true,
        sparse: true
    },
    password: {
        type: String,
        required: [true, "password shouldn't be empty"],
        min: 5
    },
    role: {
        type: Number,
        default: 2 //1 for admin, 2 for normal users
    },
    phno: {
        type: Number
    },
    dob: Date,
    status: {
        type: Boolean,
        dafault: true
    },
    address: String,
    updatedBy: String
}, {
    timestamps: true
})

const UserModel = mongoose.model('users', schema);
module.exports = UserModel;