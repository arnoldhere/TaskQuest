const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    leader: String,
    status: String,
    // teams: [
    //     {
    //         tid: { type: String, required: true },
    //         // Other fields can be added here, e.g., name, role, etc.
    //     },
    // ],
    teams: Array,
    createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;