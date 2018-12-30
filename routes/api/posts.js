const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const passport = require('passport');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });

  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const upload = multer({storage: storage, fileFilter: fileFilter});


  

const Post = require('../../models/Posts');

//@route    Get api/posts/test
//@desc     Tests Post Route
//@access   Public
router.get('/test', (req, res) => res.json({msg: 'Posts Works'}));

//@route    Post api/posts
//@desc     Create Post Route
//@access   Private
  
router.post("/", upload.single('image'), passport.authenticate('jwt', {session:false}), (req, res) => {
      console.log(req.file);
    const post = new Post({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      description : req.body.description,
      price: req.body.price,
      image: req.file.path,
      user: req.user.id,
      name:req.user.name,
      avatar:req.user.avatar

    });
    post
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json(post);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  

module.exports= router;