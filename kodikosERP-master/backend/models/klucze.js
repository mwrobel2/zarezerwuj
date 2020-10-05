const mongoose = require('mongoose');

// schema is only a blueprint
const kluczeSchema = mongoose.Schema({
    id: String,
    // nazwa klucza
    fullName: String,
    numerKlucza: String,
    rfidKlucza: String,
    login: String,
    imie: String,
    nazwisko: String,
    // dni tygodnia w których dana osoba może pobierać klucze
    dniTygodnia: [{dzien: String, odGodziny: String, doGodziny: String}],
    // konkretne daty w których osoba może pobrać klucz
    konkretneDaty: [{data: Date, odGodziny: String, doGodziny: String}],
    zaklad: String,
    nrKarty: String,
    comments: String,
    accountManager: String,
    accountManagerLogin: String,
    addBy: { login: String, name: String, surname: String, email: String },
    modBy: { login: String, name: String, surname: String, email: String },
    addDate: Date,
    modDate: Date,
    status: String,
    aktywny: Boolean,
    godzinaOd: String,
    godzinaDo: String
}, { collection: 'klucze' });

// to create data we need model
module.exports = mongoose.model('Klucze', kluczeSchema);
