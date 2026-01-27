// backend/src/controllers/auth.controller.js

import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// =================================================================
// Sign Up Controller
// =================================================================
export const signupController = async (req, res) => {
    const { name, email, password } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "An account with this email already exists." });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // 4. Save to database
        await newUser.save();

        // Optional: Generate token immediately after sign up
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: "User registered successfully.",
            token, // Return token for immediate login
            userId: newUser._id
        });

    } catch (error) {
        // Handle server/database errors
        res.status(500).json({ message: "Internal server error during registration.", error: error.message });
    }
};

// =================================================================
// Login Controller
// =================================================================
export const loginController = async (req, res) => {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // 1. Check if user exists
        const user = await User.findOne({ email });
        
        if (!user) {
            // Specific error message for frontend clarity
            return res.status(404).json({ message: "No account found with this email." });
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Specific error message for frontend clarity
            return res.status(401).json({ message: "Invalid credentials. Please check your password." });
        }

        // 3. Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // 4. Successful login response
        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        // Handle server/database errors
        res.status(500).json({ message: "Internal server error during login.", error: error.message });
    }
};