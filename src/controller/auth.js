const crypto = require('crypto');
require('dotenv').config({path: '../../config/config.env'})
const User = require('../model/User');
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../util/ErrorResponse')
const sendEmail = require('../util/nodemailer')

exports.registerUser = asyncHandler( async(req, res, next) => {

    const {email} = req.body;
    let user = await User.findOne({"email": email});
    if (user) {
        return next(new ErrorResponse(`User with email: ${email} already exist`, 400));
    }
    user = await User.create(req.body);
    
    generateJWT(user, 201, res);
   
});

exports.loginUser = asyncHandler( async(req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return next(new ErrorResponse(`Fieds cannot be empty`, 400));
    }
    const user = await User.findOne({email}).select('+password');
    if (!user) {
        return next(new ErrorResponse(`Invalid credentials`, 400));
    }

    //Check if password match
    const passwordIsMatch = await user.passwordMatch(password);
    if (!passwordIsMatch) {
        return next(new ErrorResponse(`Invalid credentials`, 400));
    }
   
    generateJWT(user, 200, res);
})

exports.currentUser = asyncHandler( async(req, res, next) => {
    
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorResponse(`user with id ${req.user.id} not found`, 404));
    }
    res.status(200).json({
        success: true,
        data: user
    })
});

exports.logout = asyncHandler( async(req, res, next) => { 

    res.cookie('token', 'non', {expires: new Date(Date.now() + 10 * 1000 ),  httpOnly: true});
    res.status(200).json({
        success: true,
        data: {}
    })
});

exports.updatePassword = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password');
  
    if(!(await user.passwordMatch(req.body.oldPassword))){
      return next(new ErrorResponse('Password is incorrect', 401));
    }
  
    user.password = req.body.newPassword;
    await user.save();
  
    generateJWT(user, 200, res);
  });

  exports.updateUserDetails = asyncHandler(async (req, res, next) => {

    const fields = {
      name: req.body.name,
      email: req.body.email
    };
  
    const user = await User.findByIdAndUpdate(req.user.id, fields, 
      {new: true, runValidators: true}
    );
  
    res.status(200).json({
      success: true,
      data: user
    });
  });


//@desc    POST Reset forgotten password
//route    POST /api/v1/auth/forgotpassword
//access   private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorResponse(`User with this email: ${req.body.email} not found`, 404));
    }
  
    const resetToken = await user.getResetPasswordToken();
     await user.save({ validateBeforeSave: false });
     const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
  
     // Create reset url
     const message = `You are receiving this email beause you (or someone else) has 
     requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}`
  
  
     try{
       await sendEmail({
         email: user.email,
         subject: "Password reset",
         message
       });
  
       res.status(200).json({success: true, data: 'Email Sent'});
     }catch(err){
      console.log(err);
      user.resetPassword = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save({ validateBeforeSave: false});
      return next(new ErrorResponse('Email could not be sent', 500));
     }
  });
  
  //@desc    PUT Reset forgotten password
  //route    PUT /api/v1/auth/resetpassword/:resettoken
  //access   public
  exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
  
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
  
    if (!user) {
      return next(new ErrorResponse('Invalid token', 400));
    }
  
    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire= undefined;
  
    await user.save();
  
    generateJWT(user, 200, res);
  });
  

const generateJWT = (user, statusCode, res) => {

    const token = user.getSingInJsonWebToken();
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 1000),
        httpOnly: true
      };
    res
    .status(statusCode)
    .cookie('token', token, cookieOption)
    .json({
        success: true,
        token: token        
    });
}