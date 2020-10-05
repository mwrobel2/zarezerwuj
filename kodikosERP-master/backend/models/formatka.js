// mongoose formatka schema

const mongoose = require('mongoose');

// schema is only a blueprint
const formatkaSchema = mongoose.Schema({
  id: String,
  name: { type: String, required: true, },
  // fields: {field: {
  //   shortName: Boolean,
  //   type: Boolean,
  //   accountManager: Boolean,
  //   fullName: Boolean,
  //   nip: Boolean,
  //   country: Boolean,
  //   city: Boolean,
  //   street: Boolean,
  //   postcode: Boolean,
  //   paymentDeadline: Boolean,
  //   creditLimit: Boolean,
  //   creditLimitCurrency: Boolean,
  //   comments: Boolean,
  //   ceo: Boolean,
  //   regon: Boolean,
  //   krs: Boolean,
  //   status: Boolean,
  //   addDate: Boolean,
  //   modDate: Boolean,
  //   addBy: Boolean,
  //   modBy: Boolean,
  //   balance: Boolean,
  //   contrType: Boolean
  // }},
  // selectedFields: { field: {
  //   shortName: Boolean,
  //   type: Boolean,
  //   accountManager: Boolean,
  //   accountManagerLogin: Boolean,
  //   fullName: Boolean,
  //   nip: Boolean,
  //   country: Boolean,
  //   city: Boolean,
  //   street: Boolean,
  //   postcode: Boolean,
  //   paymentDeadline: Boolean,
  //   creditLimit: Boolean,
  //   creditLimitCurrency: Boolean,
  //   comments: Boolean,
  //   ceo: Boolean,
  //   regon: Boolean,
  //   krs: Boolean,
  //   status: Boolean,
  //   addDate: Boolean,
  //   modDate: Boolean,
  //   addBy: Boolean,
  //   modBy: Boolean,
  //   balance: Boolean
  //   // contrType: Boolean
  // }}
  selectedFields: {
    balance: Boolean,
    comments: Boolean,
    creditLimit: Boolean,
    paymentDeadline: Boolean,
    buttonDodajKontr: Boolean,
    buttonOfertaKontr: Boolean,
    buttonEdytujKontr: Boolean,
    buttonUsunKontr: Boolean,
    widziWszystkie: Boolean,
    adres: Boolean,
    kontakty: Boolean,
    firmy: Boolean,
    projekty: Boolean,
    kontBankowe: Boolean,
    pliki: Boolean,
    buttonPliki: Boolean
  }
}, { collection: 'forms' });

// to create data we need model
module.exports = mongoose.model('Formatka', formatkaSchema);
