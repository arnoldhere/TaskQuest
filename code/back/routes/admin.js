const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");


router.get('/fetch-newusers', async (req, res) => {

    try {
        // users with status 'pending'
        const pendingUsers = await User.find({ status: "pending" });

        // If no users found, respond with an empty array
        if (!pendingUsers || pendingUsers.length === 0) {
            return res.status(201).json({ message: "No pending users found...", users: [] });
        }

        // Respond with the list of pending users
        res.status(201).json({ message: "Succefully records fetched...", users: pendingUsers });
    } catch (error) {
        // Handle any errors that occur during the query
        console.error("Error fetching pending users:", error);
        res.status(500).json({ message: "Internal Server error", error: error.message });
    }

});

module.exports = router;