const Passenger = require('../model/Passenger');
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../util/ErrorResponse');
const Car = require('../model/Car')
const transportationFee = require('../../config/transportationFee')

exports.getAllPassengers = asyncHandler( async(req, res, next) => {
   res.status(200).json(res.advancedResult)
});

exports.getSinglePassenger = asyncHandler( async(req, res, next) => {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) {
        return next(new ErrorResponse(`Passenger with this id: ${req.params.id} not found`, 404));
    }
    res.status(200).json({
        success: true,
        data: passenger
    })
});

exports.createPassenger = asyncHandler( async(req, res, next) => {
    req.body.user = req.user.id;

    if (!req.body) {
        return next(new ErrorResponse(`Passenger fields can not be empty`, 400));
    }
    const passenger = await Passenger.create(req.body);

    res.status(200).json({
        success: true,
        data: passenger
    })
});

exports.updatePassenger = asyncHandler( async(req, res, next) => {
 
    let passenger = await Passenger.findById(req.params.id);

    if (!passenger) {
        return next(new ErrorResponse(`Passenger with id: ${req.params.id} not found`, 404));
    }

    if (passenger.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.name} is forbidden from this route`, 403))
    }
    passenger = await Passenger.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    res.status(200).json({
        success: true,
        data: passenger
    })
});

exports.deletePassenger = asyncHandler( async(req, res, next) => {
 
    let passenger = await Passenger.findByIdAndDelete(req.params.id);

    if (!passenger) {
        return next(new ErrorResponse(`Passenger with id: ${req.params.id} not found`));
    }
    if (driver.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.name} is forbidden from this route`, 403))
    }
    res.status(200).json({
        success: true,
        data: {}
    })
});

exports.newBooking = asyncHandler( async(req, res, next) => {
 
    const {email} = req.body;
    let passenger = await Passenger.findOne({"email": email});
    if (!passenger) {
        return next(new ErrorResponse(`Passenger with email: ${email} not found. Please register and create a passenger account first`, 404));
    }

    //Check for availabel car going to the same destination
    const myDestination = req.body.destination
    const carWithSameDestination = await Car.findOne(
        {'availableSeat': {$gt: 1}, 'destination': myDestination }
    )

    if (!carWithSameDestination) {
        return next(new ErrorResponse(`Sorry no car going to ${myDestination} for now!`, 404));
    }

    // Add car with same destination to passenger booking
    req.body.myTravelingCar = carWithSameDestination._id;

    // Set transportation fee from the transportation fees list
    const transportFee = transportationFee[`${req.body.destination}`] || 10;
    req.body.amount = transportFee;

   passenger.booking.push(req.body)
   await passenger.save();
    //subtract the booked seat from matched car available seat number if booking seat not empty
    
    await Car.findByIdAndUpdate(carWithSameDestination._id, {$inc: {'availableSeat': -req.body.reservedSeat}}, {new: true, runValidators: true});

    res.status(200).json({
        success: true,
        data: passenger.booking[passenger.booking.length -1]
    })
});


exports.editBooking = asyncHandler( async(req, res, next) => {
    const {email, bookingType, destination, nextOfKing,amount,reservedSeat} = req.body;
    let passenger = await Passenger.findOne({"email": email});
    if (!passenger) {
        return next(new ErrorResponse(`Passenger with email: ${email} not found. Please register and create a passenger account first`));
    }
    let passengerBooking = passenger.booking[passenger.booking.length -1]

    let oldReservedSeatNumber = passengerBooking.reservedSeat;
    
    // Set the booked car available seat to previous seat number
    const carId = passengerBooking.myTravelingCar;
    const car = await Car.findById(carId);
    const previouslyBookedNumber = car.availableSeat - oldReservedSeatNumber;

    // Update nested booking resource using position operator $
 
    await Passenger.updateOne(
        {'email':email, 'booking._id': `${passengerBooking._id}`},
        {$set: {'booking.$.email': email,'booking.$.bookingType': bookingType, 
        'booking.$.destination': destination,'booking.$.nextOfKing': nextOfKing,
        'booking.$.amount': amount, 'booking.$.reservedSeat': reservedSeat, 
        'booking.$.myTravelingCar': car._id}}
    )

    //  Set car to have the new researved seat number
    const currentBookingSeatNumber = req.body.reservedSeat
    const newNumberOfSeatReserved = previouslyBookedNumber + currentBookingSeatNumber;
    car.set({'availableSeat': newNumberOfSeatReserved})
    await car.save();
   
    res.status(200).json({
        success: true,
        data: car
    })
});

exports.deletLastItem = asyncHandler( async(req, res, next) => {
 const passenger = await Passenger.findOne({'email': req.body.email});
 passenger.booking.pop();
 await passenger.save();
 res.status(200).json({
     success: true,
     data: passenger.booking.length
 })
})