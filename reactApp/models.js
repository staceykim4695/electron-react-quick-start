// YOUR CODE HERE
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String
});

var documentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: String,
    required: true
  },
  collaborators: {
    type: Array,
    required: false
  }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Document: mongoose.model('Document', documentSchema)
};
