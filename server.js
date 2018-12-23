const express = require('express');
const mongoose = require('mongoose');

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to DB
mongoose.connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

const app = express();

app.get("/", (req,res) => res.send('Hello'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Server Listing on Port '+ port));