var express = require("express");
var router = express.Router();
let User = require("../models/user.js");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');

router.post("/login", function (req, res, next) {
  req.session.regenerate(function (err) {
    User.findOne({username: req.body.username}, function(e1, user){
      if(e1){
        res.status(500).send(e1);
      }
      else if(user == null){
        res.json("Please enter valid login info");
      }
      else{
        if(user.length == 0){
          res.json("Invalid username");
        }else{
          bcrypt.compare(req.body.password, user.password, function(e1, result){
            if(e1){
              res.status(500).send(e1);
            }
            else{
              if(result){
                let csrf = uuidv4();
                res.header("X-CSRF-TOKEN", csrf);
                req.session.user = user;
                req.session.csrf = csrf;
                user.password = undefined;
                res.json(user);
              }
              else{
                res.json("Invalid password");
              }
            }
          });
        }
      }
    });
  });
});

router.post("/register", function (req, res, next) {
  User.find({username: req.body.username}, function(e1, users){
    if(users == null){
      res.json("Please provide info for all fields");
    }
    else if(users.length == 0){
      if(req.body.password != req.body.confirmedPassword){
        res.json("Passwords do not match");
      }
      else{
        if(req.body.password.length > 4){
          const newUser = new User({firstName: req.body.firstname, lastName: req.body.lastname, username: req.body.username, password: req.body.password, userType: 'user'});
          // Encrypt the password
          bcrypt.hash(newUser.password, 10, function(e2, hash){
            if(e2){
              res.status(500).send(e2);
            }
            else{
              newUser.password = hash;
              newUser.save()
              res.json("Account has been created!");
            }
          });
        }
        else{
          res.json("Password does not have enough characters");
        }
      }
    }
    else if(e1){
      res.status(500).send(e1);
    }
    else{
      res.json("That username is already taken");
    }
  });
});

router.post('/logout', function( req, res, next ) {
  req.session.regenerate( function(err) {
     if(!err){
         res.json({error: "success"});
     }
     if(err){
         res.send(err);
     }
   });
 });

 router.put("/:userid/update", function (req, res, next) {
  User.findById(req.params.userid, function(e1, user){
    if(e1){
      res.status(500).send(e1);
    }
    else{
      if(req.body.newPassword != req.body.confNewPassword){
        res.json("Passwords do not match");
      }
      else if(req.body.newPassword.length < 4){
        res.json("Password does not have enough characters");
      }
      else{
        bcrypt.compare(req.body.oldPassword, user.password, function(e2, result){
          if(e2){
            res.status(500).send(e2);
          }
          else{
            if(result){
              bcrypt.hash(req.body.newPassword, 10, function(e3, hash){
                if(e3){
                  res.status(500).send(e3);
                }
                else{
                  user.password = hash;
                  user.save();
                  res.json("Password has been changed!");
                }
              });
            }
            else{
              res.json("The current password is not correct");
            }
          }
        });
      }
    }
  });
});

router.put("/admin", function (req, res, next) {
  User.findOne({username: req.body.username}, function(e1, user){
    if(e1){
      res.status(500).send(e1);
    }
    else{
      if(req.body.newPassword != req.body.confNewPassword){
        res.json("Passwords do not match");
      }
      else if(req.body.newPassword.length < 4){
        res.json("Password does not have enough characters");
      }
      else{
        bcrypt.hash(req.body.newPassword, 10, function(e3, hash){
          if(e3){
            res.status(500).send(e3);
          }
          else{
            user.password = hash;
            user.save();
            res.json("Password has been changed!");
          }
        });
      }
    }
  });
});

router.put("/role", function (req, res, next) {
  User.findOne({username: req.body.username}, function(e1, user){
    if(user.length != 0){
      if(req.body.action == 'make'){
        if(user.userType == 'admin'){
          res.json("User is already an administrator");
        }
        else{
          user.userType = 'admin';
          user.save();
          res.json("User is now an administrator");
        }
      }
      else if(req.body.action == 'remove'){
        if(user.userType == 'user'){
          res.json("User is already a user");
        }
        else if(user.username == 'admin'){
          res.json("Primary administrator can not be demoted");
        }
        else{
          user.userType = 'user';
          user.save();
          res.json("User is no longer an administrator");
        }
      }
      else{
        res.status(500).send("Invalid action");
      }
    }
    else{
      res.status(500).send(e1);
    }
  });
});

router.get('/search/:searchText', function(req, res, next) {
  // Search for the keyword in either the firstname, lastname, or username
  User.find({$or:[{firstName: {"$regex": req.params.searchText, "$options": "i"}}, {lastName: {"$regex": req.params.searchText, "$options": "i"}},
  {username: {"$regex": req.params.searchText, "$options": "i"}}]}, function(err, users){
    if(err){
      res.status(500).send(err);
    }
    else{
      res.json(users);
    }
  });
});

router.delete("/:username", function(req, res, next){
  if(req.params.username == 'admin'){
    res.json("Primary administrator can not be deleted");
  }
  else{
    User.findOneAndDelete({username: req.params.username}, function(err, user){
      if(err){
        res.status(500).send(err);
      }
      else{
        res.json("Deleted user!");
      }
    });
  }
});

router.get("/list", function (req, res, next) {
  User.find({}, function(err, users){
    if(err){
      res.status(500).send(err);
    }
    else{
      res.json(users);
    }
  });
});

module.exports = router;
