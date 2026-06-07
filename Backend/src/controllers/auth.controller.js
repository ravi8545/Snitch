import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse(user, res, message) {
    const token = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", token);

    return res.status(200).json({
        success: true,
        message,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    });
}

// Register
const register = async (req, res) => {
    const { email, contact, password, fullname, isSeller } = req.body;

    try {
        const existingUser = await userModel.findOne({
            $or: [{ email }, { contact }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email or contact already exists"
            });
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
            role: isSeller ? "seller" : "buyer"
        });

        return await sendTokenResponse(
            user,
            res,
            "User registered successfully"
        );

    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        return await sendTokenResponse(
            user,
            res,
            "Logged in successfully"
        );

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const googleCallback = async (req, res) => {
    try {
        const { id, emails, displayName, photos } = req.user;

        const email = emails[0].value;
        const profilePic = photos?.[0]?.value;

        let user = await userModel.findOne({ email });

        if (!user) {
            user = await userModel.create({
                email,
                googleId: id,
                fullname: displayName,
                profilePic
            });
        }

        const token = jwt.sign(
            { id: user._id },
            config.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production with HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.redirect("http://localhost:5173");
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({
            success: false,
            message: "Authentication failed"
        });
    }
};

const getMe = async (req, res) => {
    const user = req.user;

    res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })
};




export default {
    register,
    login,
    googleCallback,
    getMe
};