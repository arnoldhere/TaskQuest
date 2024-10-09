require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Auth = require("./routes/auth")
const Task = require("./routes/task")
const Admin = require("./routes/admin")

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
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // If you need to send cookies or other credentials
}));


// routes configuration
app.use('/auth', Auth);
app.use('/task', Task);
app.use('/admin', Admin);

//start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});