var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session  = require('express-session');
let User = require('./models/user.js')
var bcrypt = require('bcrypt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

let mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/cinemy', {
  useNewUrlParser: true,
}, function(){
  createData();
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
  mongoose.connection.db.dropDatabase();
})

async function createData(){
  // Create the administrator account
  let admin = new User({
  username: 'admin',
  password: 'admin',
  firstName: 'Cinemy',
  lastName: 'Admin',
  userType: 'admin'});
  // Encrypt the password
  bcrypt.hash(admin.password, 10, function(err, hash){
    if(err){
      console.log(err);
    }
    else{
      admin.password = hash;
      admin.save();
    }
  });
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(
  {
    secret:'THIS IS A SECRET KEY AND SHOULD NOT BE SHOWN TO ANYONE AND IS VERY SECRET',
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: false,
      maxAge: 120*60000// Valid session for two hours
    }
  }
));

app.use('/cinemy/api/v1', indexRouter);
app.use('/cinemy/api/v1/users', usersRouter);

app.use('/',express.static('./public'));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;
