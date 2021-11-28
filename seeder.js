const mongoose = require('mongoose');
require('dotenv').config({path: './config/config.env'})
const Driver = require('./src/model/Driver')
const Passenger = require('./src/model/Passenger')
const Car = require('./src/model/Car')

mongoose.connect(process.env.URI, function(err) {
    if(err) console.log('Error conneting to database');
    console.log('Server connected to database');
});

const deleteResource = async () => {
    try {
        await Driver.deleteMany();
        await Passenger.deleteMany();
        await Car.deleteMany(); 
        console.log('Data successfully deleted');  
        process.exit(1);
    } catch (error) {
        console.error("Could not delete data", error)
    }
    
}

if (process.argv[2] === 'd') {
    deleteResource();
}