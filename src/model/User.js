const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Schema =  mongoose.Schema;

const UserSchema =  new Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please enter your email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        min: [6, 'Minimun character length is six'],
        select: false
    },
    role: {
        type: String,
        required: [true, 'Please select your role'],
        enum: ['passenger', 'admin', 'driver', 'cashier']
    },
    resetPassword: String,
    resetPasswordExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});


UserSchema.pre('save', async function(next){
    if( !this.isModified('password') ){
        next();
      }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
});

UserSchema.methods.getSingInJsonWebToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRETE, {expiresIn: process.env.JWT_EXPIRE})
};

UserSchema.methods.passwordMatch = async function(userPassword) {
    return await bcrypt.compare(userPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = async function(){
    const resetToken = crypto.randomBytes(10).toString('hex');
    this.resetPassword = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
}

module.exports = mongoose.model('User', UserSchema)