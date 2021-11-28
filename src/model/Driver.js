const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DriverSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter driver first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please enter driver last name']
    },
    phone: {
        type: String,
        required: [true, 'Please enter driver phone number'],
        unique: true
    },
    address: {
        type: String,
        required: [true, 'Please enter driver current address']
    },
    email: {
        type: String,
        required: [true, 'Please enter driver email address'],
        unique: true
    },
    dateOfBirth: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        default: 'driver',
        required: true
    },
    picture: {
        type: String,
        default: 'driver-photo'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Driver', DriverSchema);