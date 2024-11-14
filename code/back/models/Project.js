const mongoose = require("mongoose");
const Team = require("./Team");

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    leader: String,
    status: String,
    teams: [
        {
            team: { type: mongoose.Schema.Types.ObjectId, ref: Team, required: true }, // Reference to User model
        },
    ],
    deadline: Date,
    createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;