const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../reactApp/models').User;

var session = require('express-session');
app.use(session({ secret: 'secret'}))

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport strategy
passport.use(new LocalStrategy(function(username, password, done) {
  // Find the user with the given username
  // May need to adapt this to your own model!
  User.findOne({ username: username }, function (err, user) {
    // if there's an error, finish trying to authenticate (auth failed)
    if (err) { return done(err); }
    // if no user present, auth failed
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    // if passwords do not match, auth failed
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    // auth has has succeeded
    return done(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local'), (req, res) => {
  if(req.user) {
    res.json({success: true})
  } else {
    res.json({success: false})
  }
  //passport.authenticate
})

app.post('/register', (req, res) => {
  //make a new User and save it
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  })
  newUser.save((err, user) => {
    if(err) {
      res.json({success: false})
    } else {
      res.json({success: true})
      console.log(newUser)
    }
  })
})

app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login')
  }
});

// app.get('/getUsers', (req, res) => {
//   User.find({}, (err, users) => {
//     if (err) {
//       res.send(err)
//     } else {
//       res.json(users)
//   }
//   })
// })

app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!')
})
