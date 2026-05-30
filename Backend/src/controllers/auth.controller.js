import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {config} from "../config/config.js";

async function sendTokenResponse(user, res){
    const token = jwt.sign({id: user._id}, config.JWT_SECRET, {
        expiresIn: "7d",
    });
}





// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public  
 const register = async (req, res)=>{
    const {email, contact, password, fullname} = req.body;

    try{
        // Check if user already exists
        const existingUser = await userModel.findOne({
            $or: [{email}, {contact}]
        });

        if(existingUser){
            return res.status(400).json({message: "User with this email or contact already exists"});
        }

        // Create new user
        const user = new userModel.create({
            email,
            contact,
            password,
            fullname,   
        })


      


    } catch (error) {
        console.error("Error occurred while registering user:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}















export default register;