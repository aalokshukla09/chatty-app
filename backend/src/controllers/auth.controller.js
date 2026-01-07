import User from "../models/user.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../library/utils.js";

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
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

            // TODO: send a welcome email
            
        } else {
            return res.status(400).json({message: "Invalid user data"});
        }

    } catch (error) {
        console.error("Error in signupController:", error);
        return res.status(500).json({message: "Server Error"});
        
    }
}
