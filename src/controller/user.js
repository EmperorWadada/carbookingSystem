require('dotenv').config({path: '../../config/config.env'})
const User = require('../model/User');
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../util/ErrorResponse')
const jwt = require('jsonwebtoken');

//@ Method:  POST: Create a user
//@ Route: api/v1/users
//@ security: Private

exports.createUser = asyncHandler( async (req, res, next) => {
    const {email} = req.body;
    let user = await User.findOne({"email": email});
    if (user) {
        return next(new ErrorResponse(`User with this email: ${email} already exist`, 400));
    }
    user = await User.create(req.body);

   res.status(201).json({
       success: true,
       data: user
   })
})

//@ Method:  PUT: Create a user
//@ Route: api/v1/users
//@ security: Private

exports.updateUser = asyncHandler( async (req, res, next) => {
    let user = await User.findById(req.params.id);
    if(!user) {
        return next(new ErrorResponse(`User with id: ${req.params.id} not found`, 404))
    }
    user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    res.status(200).json({
    success: true,
    data: user
    })  
})

//@ Method:  Get: Get a user
//@ Route: api/v1/users
//@ security: Private

exports.getAllUsers = asyncHandler( async (req, res, next) => {
    res.status(200).json(res.advancedResult)
})
//@ Method:  POST: Create a user
//@ Route: api/v1/users
//@ security: Private

exports.getAUser = asyncHandler( async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if(!user) {
        return next(new ErrorResponse(`User with id: ${req.params.id} not found`, 404))
    }
    res.status(200).json({
    success: true,
    data: user
    })  
})
//@ Method:  POST: Create a user
//@ Route: api/v1/users
//@ security: Private

exports.deleteUser = asyncHandler( async (req, res, next) => {
    let user = await User.findById(req.params.id)
    if(!user) {
        return next(new ErrorResponse(`User with id: ${req.params.id} not found`, 404))
    }

    user = await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
    success: true,
    data: {}
    })  
})
