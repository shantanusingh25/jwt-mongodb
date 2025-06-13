require("dotenv").config();
const express = require("express");
const path = require("path");
const colors = require("colors");
const { serverLog, serverLogFilePath } = require("./middlewares/server.logger.js");

const app = express();
const connectDB = require("./db/connect.db");

// defining the port
const HTTP_SERVER_PORT = process.env.PORT || 3001

// connecting to the database
connectDB();

//public 
app.use(express.static(path.join(__dirname, "public")));
// parsing the data , body and url-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes

app.get("/" , (req , res) => {
    res.status(200).send("Api is running.");
})

// app listening.
app.listen(HTTP_SERVER_PORT, async function () {
    try {
        console.log(`Server is running on port ${HTTP_SERVER_PORT} and url -> http://localhost:${HTTP_SERVER_PORT}`.green.underline.bold);
        await serverLog(serverLogFilePath, `Server is running on port ${HTTP_SERVER_PORT}`);
    } catch (error) {
        console.error("Failed to log server start:".bgWhite.red.bold, error);
        process.exit(1);
    }
});