// mongoose contractor schema

const mongoose = require('mongoose');

// schema is only a blueprint
const przesylkiSchema = mongoose.Schema({
  nrZapotrzebowania: String,
  doKogo: [],
  doKogoEmails: [],
  // nazwa firmy do której skierowana jest przesyłka
  fullName: String,
  terminDostawy: Date,
  rodzajPlatnosci: String,
  kwota: Number,
  comments: String,
  accountManager: String,
  accountManagerLogin: String,
  addBy: { login: String, name: String, surname: String, email: String },
  modBy: { login: String, name: String, surname: String, email: String },
  addDate: Date,
  modDate: Date,
  status: String,
  firms: [],
  projects: [],
  pliki: [],
});

// to create data we need model
module.exports = mongoose.model('Przesylki', przesylkiSchema, 'przesylki');
