const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../model/user.schema.js'); // adjust path as needed

async function register(req, res) {
    try {
        const { username, password, email } = req.body;
        console.log("[REGISTER] Incoming data:", { username, email });

        // ✅ Validate inputs
        if (!username || !password || !email) {
            console.log("[REGISTER] Missing fields");
            return res.status(400).json({ message: "Username, password, and email are required." });
        }

        // ✅ Check if username or email already exists
        const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            console.log("[REGISTER] Username or email already in use.");
            return res.status(409).json({ message: "Username or email already taken." });
        }

        // ✅ Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("[REGISTER] Password hashed");

        // ✅ Save user to DB
        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        console.log("[REGISTER] User saved:", newUser._id);

        // ✅ Generate JWT
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "MYSECRET", {
            expiresIn: "1h",
        });

        // ✅ Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // ✅ Return response
        return res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
            token,
        });

    } catch (error) {
        console.error("[REGISTER] Error occurred:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = { register };