const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const passport = require("passport");
const { check, validationResult } = require('express-validator/check');

//Load User Model
const User = require('../../models/User');
// Keys
const Keys = require('../../config/keys');

//@route    Get api/users/test
//@desc     Tests Users Route
//@access   Public
router.get('/test', (req, res) => res.json({msg: 'User Works'}));

//@route    Get api/users/register
//@desc     Register Users Route
//@access   Public
router.post('/register', [
    // name must be 2 characters long
    check('user_name', 'Name must be 2+ character Long').isLength({ min : 2 }),
    // Email must be email and also findOne if there is in exist
    check('email', 'its not a valid Email').isEmail().custom(email => {
      return User.find({email}).exec().then(user => {
        if (!user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
    // password must be 5 charchters long
    check('password', 'The password must be 5+ chars long and contain a number')
    .not().isIn(['123', 'password', 'god']).withMessage('Do not use a common word as the password')
    .isLength({ min: 5 })
    .matches(/\d/)
  ],
   

  (req, res) => {
    

    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

    

        User.findOne({ email : req.body.email })
        .then(user => {
            if(user) {
                errors.email = "Email already Exists";
                return res.status(400).json(errors);
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // Size
                    r: 'pg', // Rating
                    d: 'mm' // Default
                });

            const newUser = new User ({
                first_name : req.body.first_name,
                last_name : req.body.last_name,
                user_name : req.body.user_name,
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
    });
});

//@route    Post api/users/login
//@desc     Login Users Route / Returning JWT Token
//@access   Public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

   
    // Find user by email
    User.findOne({email}).exec()
        .then(user => {
            //check for user

            if(!user ) {
                return res.status(400).json({email : 'User not Found'});
            }

            //check password

            bcrypt.compare(password, User.password)
                .then(isMatch => {
                    if(isMatch){
                        
                        // User Matched

                            const payload = {id: user.id, user_name: user.user_name} // Create JWT Paylod
                        // Sign Token
                            JWT.sign(payload, Keys.secretOrKey, { expiresIn : 3600}, (err, token) => {
                                res.json({
                                    success : true,
                                    token : 'Bearer ' + token
                                });

                            });
                    }else {
                        return res.status(400).json({password: "Password not Match"});
                    }
                })
        })


});


//@route    Get api/users/current
//@desc     Return current user
//@access   Private

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {

    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports= router;