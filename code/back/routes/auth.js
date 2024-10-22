const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt"); // for  password hashing
const createToken = require("../utils/Token");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const authMiddleware = require("../middlewares/auth")


/************ LOGIN & AUTHENTICATE user *************/
router.post("/login-member", async (req, res) => {
    try {
        const fetched_data = req.body.data;
        console.log("Fetched Data: ", fetched_data);

        // Decrypt the data
        const decrypted_data = CryptoJS.DES.decrypt(fetched_data, "loginData");
        const user_data = JSON.parse(decrypted_data.toString(CryptoJS.enc.Utf8));
        console.log("Decrypted Data: ", user_data);

        // Validate the decrypted data
        if (!user_data.email || !user_data.password) {
            return res.status(400).json({ message: "Empty data received!" });
        }
        console.log(user_data.role)

        // Check if the email exists
        const user = await User.findOne({ email: user_data.email });
        console.log("Existing User: ", user);
        // If user doesn't exist, return an error
        if (!user) {
            return res.status(400).json({ message: "Invalid email. User not found." });
        }


        // Compare the provided password with the hashed password in the database
        const matchedPassword = await bcrypt.compare(user_data.password, user.password);
        console.log("Matched password: ", matchedPassword);

        if (matchedPassword) {
            console.log("Matched password successfully");

            // Update is_Active to true upon successful login
            user.is_Active = true;
            await user.save();


            if (user.role === user_data.role) {
                console.log("logged in successfully")
                // encrypt your data
                const userFinalData = CryptoJS.DES.encrypt(JSON.stringify(user), 'loginData').toString();
                console.log(userFinalData);
                const jwt_token = createToken(user._id);
                return res.status(201).json({ message: "Logged in successfully", user: userFinalData, token: jwt_token, role: user.role, user_status: user.status });
            }
            else {
                return res.status(400).json({ message: "Invalid role selected. Please try again." });
            }

        } else {
            console.log("Password incorrect")
            return res.status(400).json({ message: "Invalid password. Please try again." });
        }


    } catch (error) {
        console.error("Login error:", error);
        return res
            .status(500)
            .json({
                message: `Something went wrong on the server. Please try again later.`,
            });
    }
});

router.post("/login-leader", async (req, res) => {
    try {
        const fetched_data = req.body.data;
        console.log("Fetched Data: ", fetched_data);

        // Decrypt the data
        const decrypted_data = CryptoJS.DES.decrypt(fetched_data, "loginData");
        const user_data = JSON.parse(decrypted_data.toString(CryptoJS.enc.Utf8));
        console.log("Decrypted Data: ", user_data);

        // Validate the decrypted data
        if (!user_data.email || !user_data.password) {
            return res.status(400).json({ message: "Empty data received!" });
        }
        console.log(user_data.role)

        // Check if the email exists
        const user = await User.findOne({ email: user_data.email });
        console.log("Existing User: ", user);
        // If user doesn't exist, return an error
        if (!user) {
            return res.status(400).json({ message: "Invalid email. User not found." });
        }


        // Compare the provided password with the hashed password in the database
        const matchedPassword = await bcrypt.compare(user_data.password, user.password);
        console.log("Matched password: ", matchedPassword);

        if (matchedPassword) {
            console.log("Matched password successfully");
            if (user.role === user_data.role) {
                console.log("logged in successfully")
                // encrypt your data
                const userFinalData = CryptoJS.DES.encrypt(JSON.stringify(user), 'loginData').toString();
                console.log(userFinalData);
                const jwt_token = createToken(user._id);
                return res.status(201).json({ message: "Logged in successfully", user: userFinalData, token: jwt_token, role: user.role });
            }
            else {
                return res.status(400).json({ message: "Invalid role selected. Please try again." });
            }

        } else {
            console.log("Password incorrect")
            return res.status(400).json({ message: "Invalid password. Please try again." });
        }


    } catch (error) {
        console.error("Login error:", error);
        return res
            .status(500)
            .json({
                message: `Something went wrong on the server. Please try again later.`,
            });
    }
});

router.post("/login-admin", async (req, res) => {
    try {
        const fetched_data = req.body.data;
        console.log("Fetched Data: ", fetched_data);

        // Decrypt the data
        const decrypted_data = CryptoJS.DES.decrypt(fetched_data, "loginData");
        const user_data = JSON.parse(decrypted_data.toString(CryptoJS.enc.Utf8));
        console.log("Decrypted Data: ", user_data);

        // Validate the decrypted data
        if (!user_data.email || !user_data.password) {
            return res.status(400).json({ message: "Empty data received!" });
        }
        console.log(user_data.role)

        // Check if the email exists
        const user = await User.findOne({ email: user_data.email });
        console.log("Existing User: ", user);
        // If user doesn't exist, return an error
        if (!user) {
            return res.status(400).json({ message: "Invalid email. User not found." });
        }


        // Compare the provided password with the hashed password in the database
        const matchedPassword = await bcrypt.compare(user_data.password, user.password);
        console.log("Matched password: ", matchedPassword);

        if (matchedPassword) {
            console.log("Matched password successfully");
            if (user.role === user_data.role) {
                console.log("logged in successfully")
                // encrypt your data
                const userFinalData = CryptoJS.DES.encrypt(JSON.stringify(user), 'loginData').toString();
                console.log(userFinalData);
                const jwt_token = createToken(user._id);
                return res.status(201).json({ message: "Logged in successfully", user: userFinalData, token: jwt_token, role: user.role });
            }
            else {
                return res.status(400).json({ message: "Invalid role selected. Please try again." });
            }

        } else {
            console.log("Password incorrect")
            return res.status(400).json({ message: "Invalid password. Please try again." });
        }


    } catch (error) {
        console.error("Login error:", error);
        return res
            .status(500)
            .json({
                message: `Something went wrong on the server. Please try again later.`,
            });
    }
});



/************ reset password using email otp *************/

router.post('/request-otp', async (req, res) => {
    try {
        const email = req.body.email;
        console.log("Fetched email: ", email);

        // Validate the decrypted data
        if (!email) {
            return res.status(400).json({ message: "Empty data received!" });
        }

        // Check if the email exists
        const user = await User.findOne({ email: email });
        console.log("Existing User: ", user);
        // If user doesn't exist, return an error
        if (!user) {
            return res.status(400).json({ message: "Invalid email. User not found." });
        }
        //generate otp and send email
        const otp = crypto.randomInt(100000, 999999);
        console.log(otp)
        user.OtpToken = otp;
        user.OtpTokenExpires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
        await user.save();

        // Send OTP email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const SendEmail = await transporter.sendMail({
            to: email,
            // subject: 'Happy Hacking'
            subject: 'Password Reset OTP || TaskQuest',
            text: `Your OTP is ${otp}. It will expire in 5 minutes.`
        });


        if (SendEmail) {
            res.status(201).json({ message: "Enter OTP carefully" });
        }
        else {
            res.status(404).json({ message: "Error in sending email" });
        }

    } catch (error) {
        console.error(" error:", error);
        return res
            .status(500)
            .json({
                message: `Something went wrong on the server. Please try again later.`,
            });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    // if (!user || user.passwordResetToken !== otp || user.passwordResetExpires < Date.now()) {
    //     return res.status(400).json({ message: 'Invalid or expired OTP' });
    // }

    if (!user || user.OtpToken !== otp) {
        return res.status(400).json({ message: 'Invalid OTP ! try again...' });
    }

    if (user.OtpTokenExpires < Date.now()) {
        return res.status(400).json({ message: 'OTP has been expired ! try again...' });
    }

    res.status(201).json({ message: 'OTP verified', email: email });
});

router.post('/updatePassword', async (req, res) => {
    const { email, cpassword } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(cpassword, 8);

        // Set the hashed password on the user
        user.password = hashedPassword;


        // remove the otp token
        user.OtpToken = null;
        user.OtpTokenExpires = null;

        // Save the user with the new password
        await user.save();


        // Respond with success message
        res.status(201).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


/************ REGISTER user *************/

router.post("/register", async (req, res) => {
    try {
        const fetched_data = req.body.data;

        // Decrypt the data
        const decrypted_data = CryptoJS.DES.decrypt(fetched_data, "signupData");
        const user_data = JSON.parse(decrypted_data.toString(CryptoJS.enc.Utf8));

        console.log("Decrypted Data: ", user_data);

        // Validate the decrypted data
        if (
            !user_data.email ||
            !user_data.firstname ||
            !user_data.lastname ||
            !user_data.password
        ) {
            return res.status(400).json({ message: "Empty data received!" });
        }

        // Check if the email is already taken
        const userExist = await User.findOne({ email: user_data.email });
        console.log("Existing User: ", userExist);

        if (userExist) {
            return res.status(400).json({
                status: false,
                message: "Email already taken!",
            });
        } else {
            const hashed_pwd = await bcrypt.hash(user_data.password, 10);

            const user = await new User({
                firstname: user_data.firstname,
                lastname: user_data.lastname,
                email: user_data.email,
                password: hashed_pwd,
                role: user_data.role
            });
            console.log(user);
            const saved = await user.save(); // store the user record in the db

            if (saved)
                return res
                    .status(201)
                    .json({ message: "User registered successfully !!", user_status: user.status });
            else
                return res
                    .status(400)
                    .json({ message: "Error saving user! Try again later.." });
        }
    } catch (error) {
        console.error("Error occurred: ", error);
        return res
            .status(500)
            .json({
                message:
                    "Something went wrong at backend. Please try again. >> " +
                    error.message,
            });
    }
});

// Export the router
module.exports = router;
