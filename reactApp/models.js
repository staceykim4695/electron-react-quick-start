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

module.exports = {
  User: mongoose.model('User', userSchema)
};
