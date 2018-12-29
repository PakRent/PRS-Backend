const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


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


  
  
  router.post("/", upload.single('image'), (req, res) => {
      console.log(req.file);
    const post = new Post({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      description : req.body.description,
      price: req.body.price,
      image: req.file.path
    });
    post
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({msg : 'Post save Succesfully'});
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  

module.exports= router;