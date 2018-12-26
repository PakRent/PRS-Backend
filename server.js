const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const expressValidator = require('express-validator');


const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to DB
mongoose.connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

const app = express();

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

//Body Parse application / urlencoded
app.use(bodyParser.urlencoded({ extended : false }));
//Parse application Json
app.use(bodyParser.json());
//Express validator
app.use(expressValidator());

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Server Listing on Port '+ port));