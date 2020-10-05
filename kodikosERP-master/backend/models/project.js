// mongoose contractor schema
const mongoose = require('mongoose');

// schema is only a blueprint
const projectSchema = mongoose.Schema({
  id: String,
  nazwa: String,
  opis: String,
  kod: String,
  kodERP: String,
  faza: String,
  mechFinansowania: String,
  kategoria: String,
  kierownik: String,
  zastepcaKier: String,
  zespol:[{login: String, name: String, surname: String, email:String, department: String}],
  dataRozpoczecia: Date,
  dataZakonczenia: Date,
  saldo: Number,
  planowanyPrzychod: Number,
  creator: String,
  comments: String,
  addDate: Date,
  modDate: Date,
  addBy: {login: String, name: String, surname: String, email:String},
  modBy: {login: String, name: String, surname: String, email:String}
});

// to create data we need model
module.exports = mongoose.model('Project', projectSchema);
