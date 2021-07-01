const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
    authorRef: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
}, {timestamps: true});
const PostModel = new mongoose.model('Post', PostSchema);
module.exports = PostModel;