// mongoose pracownicy schema

const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');
// const bcrypt = require('bcrypt');

// schema is only a blueprint
const pracownicySchema = mongoose.Schema({
  // unique - is for optimisations only. It will not forbid to add non unique values
  login: { type: String, required: true, unique: true },
  email: { type: String },
  department: { type: String },
  name: { type: String },
  drugieImie: { type: String },
  surname: { type: String },
  username: { type: String },
  password: { type: String },
  phone: { type: String },
  status: { type: String },
  moduly: [String],
  displayName: { type: String },
  plec: { type: String },
  nazwiskoRodowe: { type: String },
  nazwiskoMatki: { type: String },
  imieMatki: { type: String },
  imieOjca: { type: String },
  dataUrodzenia: { type: Date },
  miejsceUrodzenia: { type: String },
  obcokrajowiec: { type: Boolean },
  kartaStalegoPobytu: { type: String },
  narodowosc: { type: String },
  obywatelstwo: { type: String },
  dowodOsobisty: { type: String },
  dowodWydanyPrzez: { type: String },
  paszport: { type: String },
  paszportWydanyPrzez: { type: String },
  pesel: { type: String },
  nip: { type: String },
  urzadSkarbowy: { type: String },
  wyksztalcenie: { type: String },
  zawodWyuczony: { type: String },

  pliki: [],

  rachunkiBankowe: [{ nr: String, glowny: Boolean, nazwaBanku: String }],

  stanowiska: [{
    stanowisko: String, od: Date, do: Date,
    uwagi: String, aktualne: { type: Boolean }, firmaNazwa: String, firmaId: String, department: String, dataZatrudnienia: Date, rodzajUmowy: String, dataZwolnienia: Date, zajmowaneStanowisko: String, zawodWykonywany: String, stanowiskaUwagi: String, plikiStanowiska: []
  }],

  umowyoPrace: [{ numer: String, od: Date, do: Date, typUmowy: String, dataPodpisu: Date, przedstawicielZakladu: String, umowyoPraceuwagi: String, firmaNazwa: String, firmaId: String, aktualna: { type: Boolean }, plikiUmowyPraca: [] }],

  adresyZamieszkania: [{ kraj: String, wojewodztwo: String, powiat: String, gmina: String, miejscowosc: String, ulica: String, numerDomu: String, numerMieszkania: String, kod: String, tel: String, aktualny: String, od: Date, do: Date, adrZamUwagi: String }],

  przebiegZatrudnienia: [{ od: Date, do: Date, rodzajZmiany: String, stanowisko: String, dzial: String, wymiarZatrudnienia: Number, wymiarZatrudnieniaUlamek: String, placaZasadnicza: Number, placZasWaluta: String, dodatekFunkcyjny: Number, dodFunkcWaluta: String, dodatek: Number, dodatekWaluta: String, firmaNazwa: String, firmaId: String, plikiPrzebZatr: [], podstawaPrawnaZatrudnienia: String, rodzajUmowy: String }],

  dzieci: [{ imieDziecka: String, nazwiskoDziecka: String, dataUrodzeniaDziecka: Date, peselDziecka: String, zasilekPielegnOd: Date, zasilekPielegnDo: Date, zasilekRodzinnyOd: Date, zasilekRodzinnyDo: Date, plikiDzieci: [] }],

  oswiadczenia: [{ nazwaOswiadczenia: String, typOswiadczenia: String, kodZawoduOsw: String, pracodawcaUzytkownikOsw: String, plikiOswiadczenia: [], OswOd: Date, OswDo: Date }],

  zezwolenia: [{ nazwaZezwolenia: String, typZezwolenia: String, kodZawoduZezw: String, pracodawcaUzytkownikZezw: String, plikiZezwolenia: [], ZezwOd: Date, ZezwDo: Date }],

  kartyPobytu: [{ kartaOd: Date, kartaDo: Date, nazwaKarty: String, numerKarty: String, plikiKP: [] }],

  paszporty: [{ paszportOd: Date, paszportDo: Date, nrPaszportu: String, plikiKP: [] }],

  badaniaOkresowe: [{ od: Date, do: Date, badOkrUwagi: String, aktualne: { type: Boolean }, plikiBadOkr: [] }],

  szkoleniaBHP: [{ od: Date, do: Date, szkoleniaBhpUwagi: String, aktualne: { type: Boolean }, plikiBHP: [] }],

  dodatkoweKwalifikacje: [{ od: Date, do: Date, dodKwalifUwagi: String, plikiKwalifikacje: [] }],

  wyroznieniaKary: [{ od: Date, do: Date, wyrKarUwagi: String, plikiWyrKar: [] }],

  uwagi: { type: String },
  aktualniePracujacy: { type: Boolean },

  contractorFields: {
    accountManager: { type: Boolean },
    accountManagerLogin: { type: Boolean },
    addBy: { type: Boolean },
    addDate: { type: Boolean },
    balance: { type: Boolean },
    ceo: { type: Boolean },
    city: { type: Boolean },
    comments: { type: Boolean },
    contrType: { type: Boolean },
    country: { type: Boolean },
    creditLimit: { type: Boolean },
    creditLimitCurrency: { type: Boolean },
    fullName: { type: Boolean },
    krs: { type: Boolean },
    modBy: { type: Boolean },
    modDate: { type: Boolean },
    nip: { type: Boolean },
    paymentDeadline: { type: Boolean },
    postcode: { type: Boolean },
    regon: { type: Boolean },
    shortName: { type: Boolean },
    status: { type: Boolean },
    street: { type: Boolean },
    countryShipping: { type: Boolean },
    streetShipping: { type: Boolean },
    cityShipping: { type: Boolean },
    postcodeShipping: { type: Boolean },
    buttonDodajKontr: { type: Boolean },
    buttonOfertaKontr: { type: Boolean },
    buttonEdytujKontr: { type: Boolean },
    buttonUsunKontr: { type: Boolean },
    widziWszystkie: { type: Boolean },
    adres: { type: Boolean },
    kontakty: { type: Boolean },
    firmy: { type: Boolean },
    projekty: { type: Boolean },
    kontBankowe: { type: Boolean },
    pliki: { type: Boolean },
    buttonPliki: { type: Boolean }
  },
  szkodliwaFields: {
    comments: { type: Boolean },
    status: { type: Boolean },
    buttonDodajKontr: { type: Boolean },
    buttonEdytujKontr: { type: Boolean },
    buttonUsunKontr: { type: Boolean },
    projekty: { type: Boolean },
    firmy: { type: Boolean },
    widziWszystkie: { type: Boolean },
    pliki: { type: Boolean },
    buttonPliki: { type: Boolean }
  },
  assortmentFields: {
    comments: { type: Boolean },
    status: { type: Boolean },
    buttonDodajKontr: { type: Boolean },
    buttonOfertaKontr: { type: Boolean },
    buttonEdytujKontr: { type: Boolean },
    buttonUsunKontr: { type: Boolean },
    projekty: { type: Boolean },
    firmy: { type: Boolean },
    widziWszystkie: { type: Boolean },
    pliki: { type: Boolean },
    buttonPliki: { type: Boolean },
  },
  sekretariatFields: {
    comments: { type: Boolean },
    status: { type: Boolean },
    buttonDodajKontr: { type: Boolean },
    buttonOfertaKontr: { type: Boolean },
    buttonEdytujKontr: { type: Boolean },
    buttonUsunKontr: { type: Boolean },
    projekty: { type: Boolean },
    firmy: { type: Boolean },
    widziWszystkie: { type: Boolean },
    pliki: { type: Boolean },
    buttonPliki: { type: Boolean },
  },
  warehouseFields: {
    comments: { type: Boolean },
    status: { type: Boolean },
    buttonDodajKontr: { type: Boolean },
    buttonOfertaKontr: { type: Boolean },
    buttonEdytujKontr: { type: Boolean },
    buttonUsunKontr: { type: Boolean },
    projekty: { type: Boolean },
    firmy: { type: Boolean },
    widziWszystkie: { type: Boolean },
    pliki: { type: Boolean },
    buttonPliki: { type: Boolean },
  },
  nrKartyWejsciowej: { type: String },
  nrKartyParkingowej: { type: String },
  klucze: []
});

// pracownicySchema.statics.hashPassword = function hashPassword(password) {
//   return bcrypt.hashSync(password, 10);
// };

// pracownicySchema.methods.isValid = function (hashedpassword) {
//   return bcrypt.compareSync(hashedpassword, this.password);
// };

// I'm using uniqueValidator plugin on pracownicySchema
// pracownicySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Pracownicy', pracownicySchema);
