const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require ('mongoose');
const { check, validationResult } = require('express-validator/check');

const Profile = require ('../../models/Profile');
const User = require('../../models/User');

//@route    Get api/profile/test
//@desc     Tests Profile Route
//@access   Public
router.get('/test', (req, res) => res.json({msg: 'Profile Works'}));

router.get('/', passport.authenticate('jwt', {session : false }), (req, res) => {

    Profile.findOne({ user : req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                return res.status(404).json({noprofile : 'there is no profile'});
            }else {
                return res.json(profile);
            } 
        })
});


router.get('/:handle', (req, res) => {

    const errors = {};

    Profile.findOne({ handle : req.params.handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is No Profile for This User';
                return res.status(404).json(errors);
            }  
                 res.json(profile)
        
        })
        .catch(err => res.json(err));
})


router.post('/', [check('handle', 'Must Be provide a handle Name').isEmpty()],passport.authenticate('jwt', {session : false }), (req, res) => {

    

    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

    const profileFields = {};
    profileFields.user = req.user.id

    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.address) profileFields.address = req.body.address;

    Profile.findOne({ user : req.user.id})
        .then(profile => {
            if(profile) {
                Profile.findOneAndUpdate({ user : req.user.id}, { $set : profileFields }, {new : true})
                    .then(profile => res.json(profile));
            } else {
                Profile.findOne({ handle : profileFields.handle})
                .populate('user', ['name', 'avatar'])
                .then (profile => {
                    if(profile){
                        errors.handle = "That Handle already Exist";
                        res.status(400).json(errors);
                    }
                    //Save Profile

                    new Profile(profileFields).save().then(profile => res.json(profile));
                })
            }
        });
});

module.exports= router;