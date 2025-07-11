const router = require("express").Router();
const { login } = require("../controllers/login.controller.js");

router.use((req, res, next) => {
    // Middleware to log request details
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

router.post("/", login);

module.exports = router;