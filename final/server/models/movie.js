var mongoose = require('mongoose');

var MovieSchema = mongoose.Schema({
    adult: Boolean,
    backdrop_path: String,
    genres: [String],
    id: Number,
    original_language: String,
    original_title: String,
    overview: String,
    popularity: Number,
    poster_path: String,
    release_date: String,
    title: String,
    video: Boolean,
    vote_average: Number,
    vote_count: Number,
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    num_posts: Number
});

var Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;