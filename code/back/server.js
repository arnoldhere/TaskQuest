require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT;
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Auth = require("./routes/auth")
const member = require("./routes/member")
const Admin = require("./routes/admin");
const Leader = require("./routes/leader");
const User = require('./models/User');

// Mongodb configuration
const MongodbURL = process.env.MONGODB_URL;
// Connect to MongoDB
mongoose.connect(MongodbURL)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));


// express app configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // For parsing application/json
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
    origin: ["http://192.168.133.1:3000/", "http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // If you need to send cookies or other credentials
}));


// routes configuration
app.use('/auth', Auth);
app.use('/admin', Admin);
app.use('/leader', Leader);
app.use('/member', member);

//Folder stores the file uploads
// app.use("/uploads", express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.use('/logout', async (req, res) => {
    const { email } = req.body;
    console.log(email);

    try {
        const user = await User.findOne({ email: email });
        console.log(user);

        // Set is_Active to false on logout
        user.is_Active = false;
        await user.save(); // Save the updated user document

        res.status(201).json({ message: 'Logout successful' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

});

//start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});