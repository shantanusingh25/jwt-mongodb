const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../model/user.schema.js');

async function login(req, res) {
    try {
        const { username, password } = req.body;
        console.log("[LOGIN] Login attempt:", username);

        // ✅ Input validation
        if (!username || !password) {
            console.log("[LOGIN] Missing username or password");
            return res.status(400).json({ message: "Username and password are required." });
        }

        // ✅ Check if user exists
        const user = await userModel.findOne({ username });
        if (!user) {
            console.log("[LOGIN] User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log("[LOGIN] Invalid password");
            return res.status(401).json({ message: "Invalid password" });
        }

        // ✅ Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "MYSECRET", {
            expiresIn: "1h",
        });

        // ✅ Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // ✅ Send response
        console.log("[LOGIN] Login successful:", user._id);
        return res.status(200).json({
            message: "Login successful.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error("[LOGIN] Error occurred:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = { login };
