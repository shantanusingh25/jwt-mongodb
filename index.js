require("dotenv").config();
const express = require("express");
const path = require("path");
const colors = require("colors");
const { serverLog, serverLogFilePath } = require("./middlewares/server.logger.js");
const requestLogger = require("./middlewares/req-res-logger.js");
const register_route = require("./routes/register.route.js");
const login_route = require("./routes/login.route.js");
const app = express();
const connectDB = require("./db/connect.db");

// Define port
const HTTP_SERVER_PORT = process.env.PORT || 3001;

// Connect to DB
connectDB();

// Logger Middleware
const reqResLogFilePath = path.join(__dirname, "logs/req-res.log.txt");
app.use(requestLogger(reqResLogFilePath)); // Apply logger to all requests

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Static Middleware - should be before custom routes
app.use(express.static(path.join(__dirname, "public")));

//: API route
app.use("/api/auth/register"  , register_route)
app.use("/api/auth/login" , login_route);

// Server start
app.listen(HTTP_SERVER_PORT, async () => {
    try {
        console.log(
            `Server is running on http://localhost:${HTTP_SERVER_PORT}`.green.underline.bold
        );
        await serverLog(serverLogFilePath, `Server started on port ${HTTP_SERVER_PORT}`);
    } catch (error) {
        console.error("Logging failed:".bgWhite.red, error.message);
        process.exit(1);
    }
});
