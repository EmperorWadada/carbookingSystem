const ErrorResponse = require('../util/ErrorResponse');

const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message

   console.log(err);

    if ( err.code === 11000) {
        const msg = 'User already exist';
        error = new ErrorResponse(msg, 400)
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(errorObject => errorObject.message)
        error = new ErrorResponse(message, 400)
    }

    if (err.name === 'CastError') {
        const message = 'User Id not in correct format';
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        sucess: false,
        message: error.message,
        errorName: err.name
    })
    next();


}

module.exports = errorHandler;