const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Booking = require('./Booking')

const PassengerSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter your first name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please enter your last name'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Please enter your phone number'],
        unique: true
    },
    address:{
        type: String,
        required: [true, 'Please enter your current home address here']
    },
    email: {
        type: String,
        default: 'No email',
        unique: true
    },
    role: {
        type: String,
        default: 'Passenger',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        requred: true
    },
    booking: [Booking]
});

module.exports = mongoose.model('Passenger', PassengerSchema);