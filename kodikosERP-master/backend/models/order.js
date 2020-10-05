// mongoose contractor schema

const mongoose = require('mongoose');

// schema is only a blueprint
const orderSchema = mongoose.Schema({
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
  items: [{name: String, quantity: Number, priceNetBuy: Number, unit: String, priceNetSell: Number, vat: Number}]
});

// to create data we need model
module.exports = mongoose.model('Order', orderSchema);
