const mongoose = require("mongoose");

// Assuming you have a User model
const User = require("./User"); // Import the User model if it's in a different file

const teamSchema = new mongoose.Schema({
    name: String,
    description: String,
    members: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true }, // Reference to User model
        },
    ],
    leader: String,
    createdAt: { type: Date, default: Date.now },
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
