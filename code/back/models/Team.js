const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: String,
    description: String,
    members: Array,
    leader: String,
    createdAt: { type: Date, default: Date.now },
});

const team = mongoose.model("Team", teamSchema);

module.exports = team;