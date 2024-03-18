// Import necessary modules
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Create an Express router
const router = express.Router();

// Registration (Sign Up) Route
router.post("/register", async (req, res) => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Return success message
    res.status(201).json({ message: "User registered successfully" , id: savedUser.
_id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    console.log("Received login request"); // Debugging statement

    // Find the user by email
    console.log("Searching for user by email:", req.body.email); // Debugging statement
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("User not found"); // Debugging statement
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    console.log("Comparing passwords"); // Debugging statement
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      console.log("Invalid password"); // Debugging statement
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Login successful"); // Debugging statement
    res.status(200).json({ id: user._id, username: user.username });
  } catch (err) {
    console.error("Error during login:", err.message); // Debugging statement
    res.status(500).json({ message: err.message });
  }
});

// Export the router
module.exports = router;
