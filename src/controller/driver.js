const path = require('path');
require('dotenv').config({path: '../../config/config.env'})
const Driver = require('../model/Driver');
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../util/ErrorResponse')

//@ Method:  GET: Get all driver
//@ Route: api/v1/driver
//@ security: Public

exports.getAllDrivers = asyncHandler( async (req, res, next) => {
  const driver = await Driver.find();
  
    res.status(200).json({
    success: true,
    count: driver.length,
    data: driver
    })  
})

//@ Method:  GET: Get a single driver
//@ Route: api/v1/driver/:id
//@ security: Private

exports.getDriverById = asyncHandler (async (req, res, next) => {
 const driver = await Driver.findById(req.params.id);

 if (!driver) {
    return next(new ErrorResponse(`driver with id: ${req.params.id} not found`, 404))
}

 if (driver.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.name} is forbidden from this route`, 403))
}

 res.status(200).json({
     success: true,
     data: driver
 })
})

//@ Method:  POST: Add a driver
//@ Route: api/v1/driver
//@ security: private

exports.createDriver =  asyncHandler( async (req, res, next) => {
    req.body.user = req.user.id;
    const driver = await Driver.create(req.body);
    res.status(200).json({
        success: true,
        data: driver
    })
});

//@ Method:  PUT: Update a driver
//@ Route: api/v1/driver/:d
//@ security: private

exports.UpdateDriverDetails =  asyncHandler( async (req, res, next) => {

    let driver = await Driver.findById(req.params.id);
    if (!driver) {
        return next(new ErrorResponse(`driver with id: ${req.params.id} not found`, 404))
    }

    if (driver.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.name} is forbidden from this route`, 403))
    }

    driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    res.status(200).json({
        success: true,
        data: driver
    })
});

//@ Method:  DELETE: Delete a driver
//@ Route: api/v1/driver/:Id
//@ security: private

exports.DeleteADriver =  asyncHandler( async (req, res, next) => {

    let driver = await Driver.findById(req.params.id);
    if (!driver) {
        return next(new ErrorResponse(`driver with id: ${req.params.id} not found`, 404))
    }

    if (driver.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.name} is forbidden from this route`, 403))
    }
    driver = await Driver.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: {}
    })
});

//@ Method:  PUT: update driver photo
//@ Route: api/v1/driver/photo/:driverId
//@ security: private

exports.updatePhoto =  asyncHandler( async (req, res, next) => {

   const driverId = req.params.driverId
   const driver = await Driver.findById(driverId);
   
   if (!driver) {
       return next(new ErrorResponse(`Driver with this id: ${driverId} not found`, 404))
   }

   if (driver.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.name} is forbidden from this route`, 403))
    }

   if ( !req.files) {
       return next(new ErrorResponse("Please upload driver's photo", 400));
   }
   
   const file = req.files.file;

   if ( !file.mimetype.startsWith('image')) {
       return next(new ErrorResponse("Please upload an image file only", 400))
   }

   if (file.size > process.env.FILE_UPLOAD_LIMIT) {
       return next(new ErrorResponse('File size too large, file size most be less than 10MB', 400))
   }

   file.name = `photo_${driverId}${path.parse(file.name).ext}`;
   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      
    if (err) {
           console.error(err);
           return next(new ErrorResponse('Could not upload file', 500));
       }

        await Driver.findByIdAndUpdate(driverId, {picture: file.name});

        res.status(200).json({
            success: true,
            data: file.name
        });
   });
});



