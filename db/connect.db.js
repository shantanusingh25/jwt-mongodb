require("dotenv").config();
const mongoose = require("mongoose");
const colors = require("colors");
const { dbLog, dbLogFilePath }   = require("../middlewares/db-logs.logger.js");

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI || "mongodb://localhost:27017/jwt-mongodb";

        if (!dbURI) {
            console.error("MONGO_URI is not defined".bgWhite.red.bold.underline);
            await dbLog(dbLogFilePath, "MONGO_URI is not defined");
            console.error("Please check your .env file".bgWhite.red.bold.underline);
            process.exit(1); 
        }

        const conn = await mongoose.connect(dbURI);
 
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`.green.bold);
        await dbLog(dbLogFilePath, `MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        console.error(
            `❌ Error connecting to the database: ${error.message}`.bgWhite.red.bold
                .underline
        );
        await dbLog(dbLogFilePath, `Error connecting to the database: ${error.message}`);
        console.error("Please check your MONGO_URI in the .env file".bgWhite.red.bold.underline);
        process.exit(1);
    }
};

module.exports = connectDB;