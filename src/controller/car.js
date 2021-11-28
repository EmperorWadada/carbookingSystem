const path = require('path')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../util/ErrorResponse')
const Car = require('../model/Car');


exports.createCar = asyncHandler( async(req, res, next) => {
    const {carNumber} = req.body;
    req.body.user = req.user.id,
    req.body.carOwner = req.body.carOwner.toLowerCase();

    //Check if car number already exist
    let car = await Car.findOne({"carNumber": carNumber});
    if (car) {
        return next(new ErrorResponse(`This car number: ${carNumber} already exist`, 400))
    }
    car = await Car.create(req.body)
    res.status(200).json({
        success: true,
        data: car
    })
});

exports.getAllCars = asyncHandler( async(req, res, next) => {
   res.status(200).json(res.advancedResult)
});

exports.getSingleCar = asyncHandler( async(req, res, next) => {
    const car = await Car.findById(req.params.id);
    if (!car) {
        return next(new ErrorResponse(`cars with id: ${req.params.id} not found`, 404))
    }
    res.status(200).json({
        success: true,
        data: car
    })
});

exports.updateCarInfo = asyncHandler( async(req, res, next) => {
   let car = await Car.findById(req.params.id);
   if (!car) {
       return next(new ErrorResponse(`Car with this id: ${req.params.id} not found`, 404))
   }
   // Check if user is the owner of the car
   if (car.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.name} is forbidden from this route`, 403))
   }
   car = await Car.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
   res.status(200).json({
       success: true,
       data: car
   })
})

exports.deleteACar = asyncHandler( async(req, res, next) => {
    let car = await Car.findById(req.params.id);
    if (!car) {
        return next(new ErrorResponse(`cars with id: ${req.params.id} not found`, 404))
    }
    if (car.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.name} is forbidden from this route`, 403))
    }
    car = await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: {}
    })
})


exports.uploadPhonto = asyncHandler( async(req, res, next) => {
    let carId = await Car.findById(req.params.carId);
    if (!carId) {
        return next(new ErrorResponse(`cars with id: ${carId} not found`, 404))
    }
    if (car.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.name} is forbidden from this route`, 403))
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload picture of the car`, 400))
    }

    const file = req.files.file;
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file only`, 400))
    }

    if (file.size > process.env.FILE_UPLOAD_LIMIT) {
        return next(new ErrorResponse(`File size can not be more 10MB`, 400))
    }

    file.name = `photo_${carId.carNumber}${path.extname(file.name)}`
  
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
          return console.error(err || "Sever Error")
        }

        carId = await Car.findByIdAndUpdate(carId, {"picture": file.name}, {new: true, runValidators: true});
        res.status(200).json({
            success: true,
            data: carId
        });
    })
})