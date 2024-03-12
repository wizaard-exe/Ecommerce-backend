const mongoose = require('mongoose');
const tryCatchErrorHandler = require('./errorHandler/tryCatchErrorHandler');
const ErrorHandler = require("./errorHandler/ErrorHandler");

const connectDB = tryCatchErrorHandler(async () => {
    try {
        await mongoose.connect(process.env.DB_URL,{dbName:"Ecomerce"});
        console.log("Data base Connected");
    } catch (error) {
        console.error(`DATABASE CONNECTION ERROR: ${error.message}`);
    }
});
module.exports = connectDB;

