const path = require('path');
const express = require('express');
const mongoSanitizer = require('express-mongo-sanitize')
const helmet = require('helmet');
require('dotenv').config({path: './config/config.env'});
const expressFileUpload = require('express-fileupload');
const connectToDB = require('./config/connectToDB');
const erroHandler = require('./src/middleware/errorHandler');
const driverRoute = require('./src/route/driver');
const carRoute = require('./src/route/car');
const passengerRouter = require('./src/route/passenger');
const userRouter = require('./src/route/user');
const authRouter = require('./src/route/Auth');
const cookieParser = require('cookie-parser');

const app = express();

connectToDB();

app.use(mongoSanitizer())
app.use(helmet())

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))
app.use(expressFileUpload());

app.use('/api/v1/drivers', driverRoute)
app.use('/api/v1/cars', carRoute);
app.use('/api/v1/passengers', passengerRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

app.use(erroHandler);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server connected on http://localhost:${process.env.PORT}`);
});

process.on('unhandledRejection', (err)=> {
    console.log(`Serving shutting down on port: ${process.env.PORT}` + err);
    server.close( process.exit(1) )
});