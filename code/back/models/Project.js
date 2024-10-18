    const mongoose = require("mongoose");

    const projectSchema = new mongoose.Schema({
        name: String,
        description: String,
        leader: String,
        status: String,
        teams: Array,
        createdAt: { type: Date, default: Date.now },
    });

    const Project = mongoose.model("Project", projectSchema);

    module.exports = Project;