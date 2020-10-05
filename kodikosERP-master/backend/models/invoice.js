// mongoose invoice schema

const mongoose = require('mongoose');

// schema is only a blueprint
const invoiceSchema = mongoose.Schema({
  id: String,
  company: String,
  nip: String,
  companyStreet: String,
  companyPostCode: String,
  companyCity: String,
  issuerLogin: String,
  issueDate: Date,
  sellDate: Date,
  issueCity: String,
  paymentType: String,
  factoring: String,
  currency: String,
  currencyDate: Date,
  currencyRate: Number,
  tableNBP: String,
  dueDate: Date,
  paid: Number,
  // prowizja
  commission: Number,
  paidCommision: Number,
  // towary
  commodities: [{comName: String, comQuantity: Number, comUnit: String, comPriceNet: Number, comVAT: Number}]
});

// to create data we need model
module.exports = mongoose.model('Invoice', invoiceSchema);
