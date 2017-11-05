const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../reactApp/models').User;
const Document = require('../reactApp/models').Document;

var session = require('express-session');
const MongoStore = require('connect-mongo')(session);


app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)

app.use(session({
  secret: 'secret',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

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
  //if the passport authenticate doesn't respond, then it goes to (req, res); can have multiple (req, res) until one responds
    res.json({success: true, user: req.user});
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
      res.json({success: false, error: err})
    } else {
      res.json({success: true})
    }
  })
})

app.post('/docs', (req, res) => {
  //make a new User and save it
  const newDocument = new Document({
    title: req.body.title,
    ownerid: req.user._id,
    owner: req.user.username,
    collaborators: req.body.collaborators,
    password: req.body.password,
  })
  newDocument.save((err, newDoc) => {
    if(err) {
      res.json({success: false, error: err})
    } else {
      res.json({success: true, doc: newDoc})
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

app.get('/getDocs', (req, res) => {
  // Document.find({ownerid: req.user._id, collaborators: { $in: [req.user.username] }}, (err, docs) => {
  Document.find({ $or: [{ownerid: req.user._id}, {collaborators: { $in: [req.user.username] }} ]}, (err, docs) => {
    if (err) {
      res.send(err)
    } else {
      res.json(docs)
  }
  })
})

app.get('/getDoc/:docid', (req, res) => {
  Document.findById(req.params.docid, (err, doc) => {
    if (err) {
      res.send(err)
    } else {
      res.json(doc)
    }
  })
})

// app.get('/searchDoc/:docid', (req, res) => {
//   Document.findById(req.params.docid, (err, doc) => {
//     if (err) {
//       res.send(err)
//     } else {
//       res.json(doc)
//     }
//   })
// })

app.post('/saveDoc/:docid', (req, res) => {
    Document.update({_id: req.params.docid}, { $set: {body: req.body.body, inlineStyles: req.body.inlineStyles} }, (err, result) => {
      if (err) {
        res.send({ success: false, error: err })
      } else {
        res.json({success: true, result: result})
      }
    }
  )
})

app.post('/addCollab/:docid', (req, res) => {
  User.find({username: req.body.username}, (err, result) => {
    if(err) {
      res.json({ success: false, error: err })
    } else if (result.length === 0) {
      res.json({ success: false, error: "No users found" })
    } else {
      Document.update({_id: req.params.docid}, { $addToSet: {collaborators: req.body.username }}, (err, result) => {
        if (err) {
          res.send({ success: false, error: err })
        } else {
          res.json({success: true, result: result})
        }
      })
    }
  })
})

app.post('/searchDoc/:docid', (req, res) => {
  Document.findById(req.params.docid, (err, doc) => {
      if (err) {
        res.send(err)
      } else if (doc === null) {
        res.json({success: false})
      } else if (req.body.password !== doc.password) {
          res.json({success: false})
      } else {
        Document.update({_id: req.params.docid}, { $push: {collaborators: req.user.username }}, (err, result) => {
            if (err) {
              res.send({ success: false, error: err })
            } else {
              res.json({success: true, result: doc})
            }
          })
        }
      })
    })

  // Document.update({_id: req.params.docid}, { $push: {collaborators: req.body.username }}, (err, result) => {
  //       if (err) {
  //         res.send({ success: false, error: err })
  //       } else {
  //         res.json({success: true, result: result})
  //       }
  //     })
  //   }
  // })
// })

// app.post('/removeCollab/:docid', (req, res) => {
//   User.find({username: req.body.username}, (err, result) => {
//     if(err) {
//       res.json({ success: false, error: err })
//     } else if (result.length === 0) {
//       res.json({ success: false, error: "No users found" })
//     } else {
//       Document.update({_id: req.params.docid}, { $pull: {collaborators: req.body.collaborator }}, (err, result) => {
//         if (err) {
//           res.send({ success: false, error: err })
//         } else {
//           res.json({success: true, result: result})
//         }
//       })
//     }
//   })
// })

app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!')
})
