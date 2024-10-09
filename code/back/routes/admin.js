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

router.put('/approve-user/:id', async (req, res) => {
    try {
        const userId = req.params.id
        console.log(userId);

        // Update the user status to 'confirmed'
        const user = await User.findByIdAndUpdate(userId, { status: 'confirmed' }, { new: true });

        if (user) {
            res.status(201).json({ message: 'User approved successfully', user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error occurred while approving the user', error });
    }
});

router.get('/fetch-users', async (req, res) => {
    try {
        const users = await User.find();
        const users_count = await User.countDocuments();
        console.log(users_count);
        res.status(201).json({ message: 'Users fetched successfully !!', users: users, users_count: users_count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;