// mongoose contractor schema

const mongoose = require('mongoose');

// schema is only a blueprint
const offerSchema = mongoose.Schema({
  id: String,
  data: Date,
  creator: String,
  termsOfPayment: String,
  deliveryType: String,
  labelling: String,
  packing: String,
  // atest
  certificate: String,
  // wykonanie
  realization: String,
  // tolerancja wykonania
  engeneeringTolerance: String,
  // pochodzenie towaru
  origin: String,
  // uwagi
  comments: String,
  contractor: {shortName: String, fullName: String, nip: String},
  addDate: Date,
  modDate: Date,
  currency: String,
  project: String,
  company: String,
  addBy: {login: String, name: String, surname: String, email:String},
  modBy: {login: String, name: String, surname: String, email:String},
  items: [{name: String, priceNetSell: Number, vat: Number, priceGrossSell: Number}]
});

// to create data we need model
module.exports = mongoose.model('Offer', offerSchema);
