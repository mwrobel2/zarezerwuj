const mongoose = require('mongoose');
const sekrKomentarzeSchema = mongoose.Schema({
    id: String,
    idDokumentu: String,
    imie: String,
    nazwisko: String,
    login: String,
    email: String,
    komentarz: String,
    dataKomentarza: Date
});

module.exports = mongoose.model('SekrKomentarze', sekrKomentarzeSchema);