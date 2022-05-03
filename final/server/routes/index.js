var express = require('express');
var router = express.Router();
const axios = require('axios');
const Movie = require('../models/movie');
const User = require('../models/user');
const Post = require('../models/post');
const e = require('express');

const API_KEY = 'api_key=f1146abc16795eb1c6ce25187742ce6a';
const BASE_URL = 'https://api.themoviedb.org/3';
const POP_URL = '/movie/popular?';
const NOW_URL = '/movie/now_playing?';
const TOP_URL = '/movie/top_rated?';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const GENRE_URL = '/genre/movie/list?';
const SEARCH_URL = '/search/movie?';

// ############ ROUTES ############
router.all('/movies/*', function (req, res, next) {
  if(req.session.csrf === req.header('X-CSRF-TOKEN')){
    next();
  }
  else{
    res.status(403).send("Invalid request");
  }
});

router.all('/posts/*', function (req, res, next) {
  if(req.session.csrf === req.header('X-CSRF-TOKEN')){
    next();
  }
  else{
    res.status(403).send("Invalid request");
  }
});

router.get('/movies/category/:category', function(req, res, next) {
  let url;
  if(req.params.category == 'popular'){
    url = BASE_URL + POP_URL + API_KEY;
  }
  else if(req.params.category == 'now_playing'){
    url = BASE_URL + NOW_URL + API_KEY;
  }
  else if(req.params.category == 'top_rated'){
    url = BASE_URL + TOP_URL + API_KEY;
  }
  
  axios.get(url).then(function (response){
    let movies = response.data.results;
    let genreUrl = BASE_URL + GENRE_URL + API_KEY;
    axios.get(genreUrl).then(function(response2){
      let genres = response2.data.genres;
      movies.forEach(movie => {
        let file_path = movie.poster_path;
        movie.poster_path = IMG_URL + file_path;
        file_path = movie.backdrop_path;
        movie.backdrop_path = IMG_URL + file_path;
        movie.posts = [];
        movie.num_posts = 0;
        movie.genres = [];
        for(let i = 0; i < movie.genre_ids.length; i++){
          for(let j = 0; j < genres.length; j++){
            if(genres[j].id == movie.genre_ids[i]){
              movie.genres[i] = genres[j].name;
            }
          }
        }
        delete movie.genre_ids;
        Movie.find({id: movie.id}, function(err, movdb){
          if(movdb.length == 0){
            const mov = new Movie(movie);
            mov.save();
          }
          if(err){
            res.status(500).send(err);
          }
        });
      });
      res.send(movies);
    }).catch(function(error){
      res.status(500).send(error);
    });
  }).catch(function(error){
    res.status(500).send(error);
  });
});

router.get('/movies/search/:searchText', function(req, res, next) {
  let url;
  let query = '&query=' + req.params.searchText;
  url = BASE_URL + SEARCH_URL + API_KEY + query;
  
  axios.get(url).then(function (response){
    let movies = response.data.results;
    let genreUrl = BASE_URL + GENRE_URL + API_KEY;
    axios.get(genreUrl).then(function(response2){
      let genres = response2.data.genres;
      movies.forEach(movie => {
        let file_path = movie.poster_path;
        movie.poster_path = IMG_URL + file_path;
        file_path = movie.backdrop_path;
        movie.backdrop_path = IMG_URL + file_path;
        movie.posts = [];
        movie.num_posts = 0;
        movie.genres = [];
        for(let i = 0; i < movie.genre_ids.length; i++){
          for(let j = 0; j < genres.length; j++){
            if(genres[j].id == movie.genre_ids[i]){
              movie.genres[i] = genres[j].name;
            }
          }
        }
        delete movie.genre_ids;
        Movie.find({id: movie.id}, function(err, movdb){
          if(movdb.length == 0){
            const mov = new Movie(movie);
            mov.save();
          }
          if(err){
            res.status(500).send(err);
          }
        });
      });
      res.send(movies);
    }).catch(function(error){
      res.status(500).send(error);
    });
  }).catch(function(error){
    res.status(500).send(error);
  });
});

router.get('/movies/:mid', function(req, res, next) {
  Movie.findOne({id: req.params.mid}).populate({path: 'posts', model: 'Post'}).populate({path: 'posts', populate: {path: 'user', model: 'User'}}).exec(function(err, movie){
    if(movie){
      res.send(movie);
    }
    else{
      res.status(500).send("Movie not found");
    }
  });
});

router.post('/movies/:mid/post/:userid', function(req, res, next) {
  if(req.body.title, req.body.score, req.body.description){
    Movie.findOne({id: req.params.mid}).populate({path: 'posts', model: 'Post'}).populate({path: 'posts', populate: {path: 'user', model: 'User'}}).exec(function(e1, movie){
      if(movie){
        User.findById(req.params.userid, function(e2, user){
          if(user){
            const post = new Post({user: user, title: req.body.title, description: req.body.description, score: req.body.score, movieTitle: movie.title});
            post.save();
            post.populate('user');
            movie.posts.push(post);
            movie.num_posts++;
            movie.save();
            res.json(movie);
          }
          else{
            res.status(500).send("User not found");
          }
        })
      }
      else{
        res.status(500).send("Movie not found");
      }
    });
  }
  else{
    res.json("Please fill out all fields to make a post.")
  }

});

router.get('/posts/:userid', function(req, res, next) {
  User.findById(req.params.userid, function(e1, user){
    if(user){
      Post.find({user: user}).populate('user').exec(function(e2, posts){
        if(posts){
          res.send(posts);
        }
        else{
          res.status(500).send(e2);
        }
      });
    }
    else{
      res.status(500).send(e1);
    }
  });
});

router.get('/posts', function(req, res, next) {
  Post.find({}).populate('user').exec(function(err, posts){
    if(posts){
      res.send(posts);
    }
    else{
      res.status(500).send(err);
    }
  });
});

router.put('/posts/:pid', function(req, res, next) {
  Post.findById(req.params.pid).populate('user').exec(function(err, post){
    if(post){
      post.title = req.body.title;
      post.score = req.body.score;
      post.description = req.body.description;
      post.save();
      res.json("Post has been updated!");
    }
    else{
      res.status(500).send(err);
    }
  });
});

router.delete('/posts/:pid', function(req, res, next) {
  Post.findById(req.params.pid, function(e1, post){
    if(e1){
      res.status(500).send(e1);
    }
    else{
      Movie.findOneAndUpdate({title: post.movieTitle}, {$inc: {num_posts: -1}}, function(e2, movie){
        if(e2){
          res.status(500).send(e2);
        }
      });
    }
  });
  Post.findByIdAndDelete(req.params.pid, function(err, post){
    if(err){
      res.status(500).send(err);
    }
    else{
      res.json("Deleted post!");
    }
  });
});

router.get('/posts/search/:searchText', function(req, res, next) {
  // Search for the keyword in either the title or the description
  Post.find({$or:[{title: {"$regex": req.params.searchText, "$options": "i"}}, {description: {"$regex": req.params.searchText, "$options": "i"}}]})
  .populate('user').exec(function(err, posts){
    if(err){
      res.status(500).send(err);
    }
    else{
      res.json(posts);
    }
  });
});

module.exports = router;
