const mongoose = require('mongoose');

const kluczeRejestrSchema = mongoose.Schema({
    id: String,
    numerKlucza: String,
    rfidKlucza: String,
    comments: String,
    liczbaWydan: Number,
    accountManager: String,
    accountManagerLogin: String,
    addBy: { login: String, name: String, surname: String, email: String },
    modBy: { login: String, name: String, surname: String, email: String },
    addDate: Date,
    modDate: Date,
    aktywny: Boolean,
}, { collection: 'kluczeRejestr' });

// to create data we need model
module.exports = mongoose.model('KluczeRejestr', kluczeRejestrSchema);
