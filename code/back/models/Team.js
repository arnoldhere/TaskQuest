const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: String,
    description: String,
    // members: [
    //     {
    //         email: { type: String, required: true },
    //         // Other fields can be added here, e.g., name, role, etc.
    //     },
    // ],
    members: Array,
    leader: String,
    createdAt: { type: Date, default: Date.now },
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;