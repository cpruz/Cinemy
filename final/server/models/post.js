var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: String,
    description: String,
    score: Number,
    movieTitle: String
});

var Post = mongoose.model("Post", PostSchema);

module.exports = Post;