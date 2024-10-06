const express = require("express");
const router = express.Router();
const Task = require("../models/Task");


router.get('/view', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/add", async (req, res) => {
    try {
        const fetched_data = req.body.data;
        const user = req.body.user;
        console.log(user);
        console.log("Fetched Data: ", fetched_data);

        // Validate the decrypted data
        if (!fetched_data) {
            return res.status(400).json({ message: "Empty data received!" });
        }

        const task = await Task.create({
            title: fetched_data.taskTitle,
            description: fetched_data.taskDescription,
            createdBy: user
        })
        const saved = await task.save();
        if (saved) {
            return res.status(201).json({ message: "Task saved successfully" });
        }
        else {
            return res.status(403).json({ message: "Task can't save" });
        }

    } catch (error) {
        console.error("Task saving err :", error);
        return res
            .status(500)
            .json({
                message: `Something went wrong on the server. Please try again later.`,
            });
    }
});
// Export the router
module.exports = router;
