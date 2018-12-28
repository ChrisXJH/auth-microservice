const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  creationTime: Date
});

module.exports = mongoose.model('SessionModel', sessionSchema);
