const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    role: { type: String, default: "member" },
    status: { type: String, default: "pending" },
    joined: { type: String, default: Date.now() },
    Avatar: Buffer,
    OtpToken: {
        type: String,
    },
    OtpTokenExpires: {
        type: Date, // Use Date for storing time
    },
});

// You can add a method to set OTP token with expiry in minutes
// userSchema.methods.setOtpToken = function(otpToken, expiresInMinutes) {
//     this.OtpToken = otpToken;
//     const now = new Date();
//     this.OtpTokenExpires = new Date(now.getTime() + expiresInMinutes * 60000); // Adds minutes
// };

const User = mongoose.model("User", userSchema);

module.exports = User;
