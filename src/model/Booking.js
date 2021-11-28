const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Booking = new Schema({
  bookingType: {
      type: String,
      required: [true, 'Please select type of booking'],
      enum: ['Evening', 'Morning']
  },
  destination: {
      type: String,
      required: [true, 'Please enter your destination']
  },
  createdAt: {
      type: Date,
      default: new Date()
  },
  nextOfKing: String,
  nextOfKinName: String,
  amount: {
      type: Number,
      required: true,
  },
  myTravelingCar: {
      type: String
  },
  reservedSeat: {
    type: Number,
    default: 1
  }
});

module.exports = Booking;