const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../config/config.env'});
const User = require('../model/User');
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../util/ErrorResponse')

exports.protect = asyncHandler(async (req, res, next) => {
   let token;
   if (req.cookies.token) {
       token = req.cookies.token;
   }

   if(!token) {
    return next(new ErrorResponse(`You are forbidden to access this route`, 403))
   }

   try {
      const decode = jwt.verify(token, process.env.JWT_SECRETE);
      req.user = await User.findById(decode.id);
      next();
   } catch (error) {
    return next(new ErrorResponse(`Not authorized to access this route`, 401))
   }
});

// Grant access to specif roles
exports.authorized = (...role) => (req, res, next) => {
    if (!role.includes(req.user.role)) {
        return next(new ErrorResponse(`Sorry ${req.user.role} is not authorized to access this route`, 401))
    }
    next();
}