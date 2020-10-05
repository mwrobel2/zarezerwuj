const mongoose = require('mongoose');

const szkodliwaSchema = mongoose.Schema({
  // nazwa
  fullName: String,
  cas: String,
  ilosc: Number,
  jednostka: String,
  miejscePrzech: String,
  osobaOdpow: String,
  zaklad: String,
  rodzajeZagrozen: [{
    id: Number, zagrozenie: String, piktogram: String,
    osobyPracujace: [{
      id: Number, imie: String, nazwisko: String,
      login: String, email: String, stanowisko: String,
      czasZmiana: Number, czasRok: Number,
    }]
  }],
  producent: String,
  rok: Number,
  addBy: { login: String, name: String, surname: String, email: String },
  modBy: { login: String, name: String, surname: String, email: String },
  addDate: Date,
  modDate: Date,
  status: String,
  projects: [],
  pliki: [],
  firms: [],
  comments: String,
  piktogramy: [],
  czasNarazeniaZmiana: Number,
  czasNarazeniaRok: Number,
  szkodType: String,
  accountManager: String,
  accountManagerLogin: String,



  shortName: String,
  nip: String,
  country: String,
  city: String,
  street: String,
  postcode: String,
  paymentDeadline: Number,
  creditLimit: Number,
  creditLimitCurrency: String,
  ceo: String,
  regon: String,
  krs: String,
  balance: Number,
  contrType: String,
  streetShipping: String,
  cityShipping: String,
  countryShipping: String,
  postcodeShipping: String,
  anotherContacts: [{ id: Number, acName: String, acSurname: String, acEmail: String, acPhone: String, acComment: String }],
  bankAccounts: [{ id: Number, dkNazwa: String, dkNrKonta: String, dkDomyslne: Boolean }],
});

module.exports = mongoose.model('Szkodliwa', szkodliwaSchema);
