// mongoose contractor schema

const mongoose = require('mongoose');

// schema is only a blueprint
const warehouseSchema = mongoose.Schema({
  itemNumber: String,
  fullName: String,
  towarOpis: String,
  rodzajTowaru: String,
  vat: Number,
  jednostka: String,
  liczba: Number,
  cenaZakupuNetto: Number,
  cenaHurtowaSprzedazyNetto: Number,
  cenaDetalicznaBrutto: Number,
  cenaDetalicznaWaluta: String,
  cenaExportEuro: Number,
  supplier: String,
  comments: String,
  idAsortymentu: String,
  warehouseLocation: String,
  regal: String,
  polka: String,
  karton: String,
  barcode: String,
  widocznyWSklepie: Boolean,
  wysokosc: Number,
  szerokosc: Number,
  dlugosc: Number,
  cenaZakupuBrutto: Number,
  cenaHurtowaSprzedazyBrutto: Number,
  cenaDetalicznaNetto: Number,
  kodIndexDostawcy: String,
  gatunek: String,
  atest: String,
  odbior: String,

  accountManager: String,
  accountManagerLogin: String,
  addBy: { login: String, name: String, surname: String, email: String },
  modBy: { login: String, name: String, surname: String, email: String },
  addDate: Date,
  modDate: Date,
  status: String,
  firms: [],
  projects: [],
  pliki: []
});

// to create data we need model
module.exports = mongoose.model('Warehouse', warehouseSchema);
