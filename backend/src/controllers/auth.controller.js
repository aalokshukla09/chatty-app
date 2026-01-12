import User from "../models/user.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../library/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const signupController = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        // check for valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({message: "Please provide a valid email"});
        }

        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        // hashing password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });
    
        if(newUser) {
            // before saving user, send welcome email
            // generateToken(newUser._id, res);
            // await newUser.save();
            
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

            // TODO: send a welcome email

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, process.env.CLIENT_URL);
            } catch (error) {
                console.error("Error sending welcome email:", error);
            }
            
        } else {
            return res.status(400).json({message: "Invalid user data"});
        }

    } catch (error) {
        console.error("Error in signupController:", error);
        return res.status(500).json({message: "Server Error"});
        
    }
}


export const loginController = async (req, res) => {
    const {email, password} = req.body;
    try {
        if(!email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Error in loginController:", error);
        return res.status(500).json({message: "Server Error"});
    }
}


export const logoutController = async (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({message: "Logged out successfully"});
}
