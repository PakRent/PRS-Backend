const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema ({

    image : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    }
});

module.exports = Post = mongoose.model('posts', PostSchema);