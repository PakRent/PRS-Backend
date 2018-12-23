const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
//Load User Model
const User = require('../../models/User');

//@route    Get api/users/test
//@desc     Tests Users Route
//@access   Public
router.get('/test', (req, res) => res.json({msg: 'User Works'}));

//@route    Get api/users/register
//@desc     Register Users Route
//@access   Public
router.post('/register', (req, res) => {
    User.findOne({email : req.body.email}).then(user => {
        if(user) {
            return res.status(400).json({email: 'Email is already Exist'});
        }else {

            const avatar = gravatar.url(req.body.email, {
                s: '200', //Size
                r: 'pg', //rating
                d: 'mm'  //Default
            });

            const newUser = new User ({
                name : req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar,
            });

            bcrypt.hash(newUser.password, 10, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            })
        }
    })
});


module.exports= router;