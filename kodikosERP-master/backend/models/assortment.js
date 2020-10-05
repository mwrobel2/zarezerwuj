// mongoose contractor schema

const mongoose = require('mongoose');

// schema is only a blueprint
const assortmentSchema = mongoose.Schema({
  fullName: String,
  towarOpis: String,
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
  rodzajTowaru: String,
  pliki: [],



  // komponent
  component: String,
  // nazwa
  name: String,
  // gatunek (słownik)
  brand: String,
  // wymiar (słownik)
  measurment: String,
  // norma
  norm: String,
  gatunek: String,
  atest: String,
  odbior: String
});

// to create data we need model
module.exports = mongoose.model('Assortment', assortmentSchema);
