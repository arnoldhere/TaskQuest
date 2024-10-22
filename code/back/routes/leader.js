const express = require("express");
const router = express.Router();
const Project = require("../models/Project")
const authMiddleware = require("../middlewares/auth")


router.get("/fetch-projects/:email",authMiddleware, async (req, res) => {

    const email = req.params.email;
    console.log(email);
    const projects = await Project.find({ leader: email }); // Assuming 'leaderEmail' is the field name in your Project schema.
    const projects_count = await Project.countDocuments().where({ leader: email });
    res.status(201).json({ message: 'Projects fetched successfully !!', projects: projects, projects_count: projects_count });
})


// Export the router
module.exports = router;
