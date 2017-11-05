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
  ownerid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  owner: {
    type: String
  },
  collaborators: {
    type: Array,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  body: {
    type: String
  },
  inlineStyles: {
    type: Object
  }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Document: mongoose.model('Document', documentSchema)
};
