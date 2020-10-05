const mongoose = require('mongoose');
const sekrPrzekazaneDoSchema = mongoose.Schema({
    id: String,
    idDokumentu: String,
    imie: String,
    nazwisko: String,
    login: String,
    email: String,
    status: String,
    dataPrzekazania: Date,
    dataOdebrania: Date,
    komentarz: String
});

module.exports = mongoose.model('SekrPrzekazaneDo', sekrPrzekazaneDoSchema);