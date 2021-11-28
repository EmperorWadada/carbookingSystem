const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarSchema = new Schema({
    carNumber: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Please add car number'],
    },
    carType: {
        type: String,
        required: [true, 'Please select car type'],
        enum: ['16-Seaters', '32-Seaters', 'luxirius-Bus']
    },
    carOwner: {
        type: String,
        required: true,
        enum: ['private', 'organization']
    },
    destination: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    availableSeat: Number,
    seatNumber: {
        type: Number,
        default: 16,
        min: [1, 'Car is filed filled up']
    },
    picture: {
        type: String,
        default: 'no-car-photo.jpg'
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

module.exports = mongoose.model('Car', CarSchema);