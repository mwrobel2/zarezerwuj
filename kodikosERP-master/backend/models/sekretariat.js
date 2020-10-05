// mongoose contractor schema

const mongoose = require('mongoose');

// schema is only a blueprint
const sekretariatSchema = mongoose.Schema({
    // _id: String,
    id: String,
    idDokumentu: String,
    // tytuł
    fullName: String,
    comments: String,
    accountManager: String,
    accountManagerLogin: String,
    addBy: { login: String, name: String, surname: String, email: String },
    modBy: { login: String, name: String, surname: String, email: String },
    addDate: Date,
    modDate: Date,
    status: String,
    firms: [],
    projects: [],
    // typ
    brand: String,
    pliki: [],
    // barcode
    // barcode: String,




    rodzajTowaru: String,
    component: String,
    name: String,
    measurment: String,
    norm: String,
    gatunek: String,
    atest: String,
    odbior: String
});

// sekretariatSchema.pre('save', function (next) {
//     this._id = new mongoose.mongo.ObjectId(this.id);
//     next();
// });

sekretariatSchema.pre('save', function (next) {
    this.id = this._id.toString();
    next();
});

// to create data we need model
// third parameter is the collection name
module.exports = mongoose.model('Sekretariat', sekretariatSchema, 'sekretariat');
