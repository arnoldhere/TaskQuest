const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");

router.get('/fetch-newusers', async (req, res) => {

    try {

        // Find users with status 'pending' and role not equal to 'admin'
        const pendingUsers = await User.find({
            status: "pending",
            role: { $ne: "admin" }
        });

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
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            })

            const message = `Dear ${user.firstname} !\n Your account is verified and activated feel free to use. \n From taskQuest`;
            const SendEmail = await transporter.sendMail({
                to: user.email,
                subject: "Account Activated | TaskQuest",
                text: message
            })

            if (SendEmail) {
                res.status(201).json({ message: 'User approved successfully', user });
            }
            else {
                console.log("Error sending email !!")
                res.status(500).json({ message: "Internal Server Error" })
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error occurred while approving the user', error });
    }
});

router.put('/reject-user/:id', async (req, res) => {
    try {
        const userId = req.params.id
        console.log(userId);

        // Update the user status to 'confirmed'
        const user = await User.findByIdAndUpdate(userId, { status: 'pending' }, { new: true });

        if (user) {
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            })

            const message = `Dear ${user.firstname} !\n Your account is kept on hold and please contact to support team for any query. \n From taskQuest`;
            const SendEmail = await transporter.sendMail({
                to: user.email,
                subject: "Account Deactivated | TaskQuest",
                text: message
            })

            if (SendEmail) {
                res.status(201).json({ message: 'User disabled successfully', user });
            }
            else {
                console.log("Error sending email !!")
                res.status(500).json({ message: "Internal Server Error" })
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error occurred while approving the user', error });
    }
});


router.put('/make-leader/:id', async (req, res) => {
    try {
        const userId = req.params.id
        console.log(userId);

        // Update the user status to 'confirmed'
        const user = await User.findByIdAndUpdate(userId, { role: 'leader' }, { new: true });

        if (user) {
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            })

            const message = `Dear ${user.firstname} !\n You've been promoted to leader. Kindly use your skills. Please contact to support team for any query. \n From taskQuest`;
            const SendEmail = await transporter.sendMail({
                to: user.email,
                subject: "Congrats | TaskQuest",
                text: message
            })

            if (SendEmail) {
                res.status(201).json({ message: 'User promoted successfully', user });
            }
            else {
                console.log("Error sending email !!")
                res.status(500).json({ message: "Internal Server Error" })
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error occurred while approving the user', error });
    }
});


router.get('/fetch-users', async (req, res) => {
    try {
        // Find users role not equal to 'admin'
        const users = await User.find({
            role: { $ne: "admin" }
        });

        const users_count = await User.countDocuments();
        console.log(users_count);
        res.status(201).json({ message: 'Users fetched successfully !!', users: users, users_count: users_count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;