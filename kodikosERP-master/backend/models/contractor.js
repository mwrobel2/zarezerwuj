// mongoose contractor schema

const mongoose = require('mongoose');

// schema is only a blueprint
const contractorSchema = mongoose.Schema({
  shortName: { type: String, required: true },
  // type: String,
  // osoba w firmie odpowiadająca za klienta klientem
  accountManager: String,
  accountManagerLogin: String,
  fullName: String,
  nip: String,
  country: String,
  city: String,
  street: String,
  postcode: String,
  paymentDeadline: Number,
  creditLimit: Number,
  creditLimitCurrency: String,
  comments: String,
  ceo: String,
  regon: String,
  krs: String,
  status: String,
  addDate: Date,
  modDate: Date,
  addBy: { login: String, name: String, surname: String, email: String },
  modBy: { login: String, name: String, surname: String, email: String },
  balance: Number,
  contrType: String,
  streetShipping: String,
  cityShipping: String,
  countryShipping: String,
  postcodeShipping: String,
  widziCeneEuro: Boolean,
  anotherContacts: [{ id: Number, acName: String, acSurname: String, acEmail: String, acPhone: String, acComment: String }],
  bankAccounts: [{ id: Number, dkNazwa: String, dkNrKonta: String, dkDomyslne: Boolean }],
  projects: [],
  firms: [],
  pliki: []
  // plikSciezka: String
});

// to create data we need model
module.exports = mongoose.model('Contractor', contractorSchema);
