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


const Profile = require('../../models/Profile');

const Post = require('../../models/Posts');

//@route    Get api/posts/test
//@desc     Tests Post Route
//@access   Public
router.get('/test', (req, res) => res.json({msg: 'Posts Works'}));

//@route    Get api/posts
//@desc     Get Posts
//@access   Public
router.get('/', (req, res) => {
    Post.find()
        .sort(
            {
                date: -1
            }
        )
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({nopostfound: 'No Post Found'}));
});

//@route    Get api/posts
//@desc     Get Single Post
//@access   Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({nopostfound: 'No Post Found With this id'}));
});

//@route    Get api/posts
//@desc     Get Single Post
//@access   Public
router.get('/:name', passport.authenticate('jwt', {session:false}), (req, res) => {
    Post.find()
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({nopostfound: 'No Post Found With this id'}));
});

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
  
//@route    Delete api/posts
//@desc     Delete post
//@access   Private

router.delete('/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
    Profile.findOne({user : req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
            .then(post =>{
                if(post.user.toString() !== req.user.id) {
                    return res.status(401).json({notauthorized : "user not authorized"});
                }
                post.remove().then(() =>{res.json({success: true})});
            })
        })

});

//@route    Like api/posts/like/:id
//@desc     Like post
//@access   Private

router.delete('/like/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
    Profile.findOne({user : req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
            .then(post =>{
                if(
                    post.likes.filter(like => like.user.toString() === req.user.id).length > 0
                ){
                    return res.status(400).json({alreadyLiked : 'user already liked this'})
                }

                post.likes.unshift({user : req.user.id});

                post.save().then(post => res.json(post));
            })
            .catch(err => res.status(404))
        })

});


//@route    unLike api/posts/unlike/:id
//@desc     unLike post
//@access   Private

router.delete('/unlike/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
    Profile.findOne({user : req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
            .then(post =>{
                if(
                    post.likes.filter(like => like.user.toString() === req.user.id).length === 0
                ){
                    return res.status(400).json({notLiked : 'You have not liked this post'})
                }

                // Get remove index
                const removeIndex = post.likes
                    .map(item => item.user.toString())
                    .indexOf(req.user.id);

                //splice out of array
                post.likes.splice(removeIndex, 1);

                //save
                post.save().then(post => res.json(post));
            })
            .catch(err => res.status(404))
        })

});


module.exports= router;