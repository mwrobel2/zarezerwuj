const mongoose = require('mongoose');

const kluczeWydaniaSchema = mongoose.Schema({
    id: String,
    numerKlucza: String,
    rfidKlucza: String,
    rfidKarty: String,
    imie: String,
    nazwisko: String,
    dzial: String,
    operacja: String,
    dataWydania: Date,
    dataZwrotu: Date,
    // info czy wpis był automatyczny czy dodany z formatki
    wpisAutomatyczny: Boolean,
    accountManager: String,
    accountManagerLogin: String,
    addBy: { login: String, name: String, surname: String, email: String },
    modBy: { login: String, name: String, surname: String, email: String },
    addDate: Date,
    modDate: Date,
}, { collection: 'kluczeWydania' });

// to create data we need model
module.exports = mongoose.model('KluczeWydania', kluczeWydaniaSchema);
