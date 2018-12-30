const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema ({

    user: {
        type : Schema.Types.ObjectId,
        ref: 'users'
    },
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
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        {
            user: {
                type : Schema.Types.ObjectId,
                ref: 'users'
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
        }
    ],
    comments: [
        {
            user: {
                type : Schema.Types.ObjectId,
                ref: 'users'
            },
            text:{
                type:String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date:{
                type: Date,
                default : Date.now
            }
        }
    ],
    date:{
        type: Date,
        default : Date.now
    }
});

module.exports = Post = mongoose.model('posts', PostSchema);