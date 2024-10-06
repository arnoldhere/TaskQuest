const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    createdBy: String,
    title: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;