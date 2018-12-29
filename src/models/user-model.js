const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  active: Boolean,
  role: Number
});

module.exports = mongoose.model('UserModel', userSchema);
