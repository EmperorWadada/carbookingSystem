const mongoose = require('mongoose');

const connectToDB = async () => {
    const conn = await mongoose.connect(process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    console.log(`Server connected to database on: ${conn.connection.host}`);
}

module.exports = connectToDB;