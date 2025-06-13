const router = require("express").Router();
const { register } = require("../controllers/register.controller.js");

router.use((req, res, next) => {
    // Middleware to log request details
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

router.post("/", register);

module.exports = router;