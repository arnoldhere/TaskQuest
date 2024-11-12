const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const Team = require("../models/Team");


router.post("/fetch-associated-teams", authMiddleware, async (req, res) => {

    const { email } = req.body;
    console.log(email);

    try {

        const teams_count = await Team.countDocuments({ members: { $elemMatch: { email } } })
        console.log("teamcount > " + teams_count);
        const teams = await Team.find({ members: { $elemMatch: { email } } });
        console.log(teams);
        return res.status(201).json({ message: "Projects fetched successfully", teams_count: teams_count  , teams:teams});


    } catch (error) {
        // Handle any errors that occur during the query
        console.error("Error fetching projecrs:", error);
        res.status(500).json({ message: "Internal Server error" });
    }

});

// Export the router
module.exports = router;
