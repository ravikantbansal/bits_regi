const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true, // Removes extra spaces
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures unique email addresses
        lowercase: true, // Converts email to lowercase
        match: [/\S+@\S+\.\S+/, "Invalid email address"], // Email validation
    },
    role: {
        type: String,
        required: true,
        enum: ["student", "teacher"], // Optional: Limit to specific roles
        default: "user",
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum password length
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
