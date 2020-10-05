// mongoose logindata schema

const mongoose = require('mongoose');

// schema is only a blueprint
const logindataSchema = mongoose.Schema({
  id: String,
  login: String,
  date: Date,
  message: String
});

// to create data we need model
module.exports = mongoose.model('LoginData', logindataSchema);
