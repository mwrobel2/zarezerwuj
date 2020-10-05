const path = require("path");
// const portsFirms = require('./portsFirms');
// const firm = portsFirms.filter(d => d.active === true);
// console.log('Nazwa bazy:', firm[0].nazwa);
// const dbName = firm[0].nazwa
const backendStart = require("./backendStart");
const dbName = backendStart.dbName;
const redisPort = backendStart.redisPort;
// console.log(dbName);
// this file store express data
const express = require("express");
const mongoose = require("mongoose");
// body-parser - parses body in post, put requests
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
var cors = require("cors");
const configBackend = require("./config/configBackend.js");

// routes
const logowanieRejestracja = require("./routes/logowanieRejestracja");
const contractorsRoutes = require("./routes/contractors");
const szkodliweRoutes = require("./routes/szkodliwe");
const warehouseRoutes = require("./routes/warehouse");
const userRoutes = require("./routes/user");
const pracownicyRoutes = require("./routes/pracownicy");
const dictionaryRoutes = require("./routes/dictionary");
const dictionary2Routes = require("./routes/dictionary2");
const assortmentRoutes = require("./routes/assortment");
const kluczeRoutes = require("./routes/klucze");
const kluczeRejestrRoutes = require("./routes/kluczeRejestr");
const kluczeWydaniaRoutes = require("./routes/kluczeWydania");
const przesylkiRoutes = require("./routes/przesylki");
const sekretariatRoutes = require("./routes/sekretariat");
const offersRoutes = require("./routes/offer");
const projectsRoutes = require("./routes/project");
const ordersRoutes = require("./routes/order");
const invoiceRoutes = require("./routes/invoice");
const nbpRoutes = require("./routes/nbp");
const krsRoutes = require("./routes/krs");
const formatkiRoutes = require("./routes/formatki");
const loginDatas = require("./routes/logindata");
const filesSend = require("./routes/filesSend");
// Passport Config
require("./config/passport")(passport);

// this is express app
// big chain of middlewares
const app = express();

// const bb = app.get('baza');
// console.log('MM', bb);

// MongoDB connection
mongoose
  // HPStal
  .connect(`mongodb://hpUser:HPHaslo@localhost:27017/` + dbName, {
    // GTSport
    // .connect(`mongodb://gtSport:gtHasloNowe@localhost:27017/` + dbName, {
    // MirPib
    // .connect(`mongodb://mirDbUser:hasloDoBazy@localhost:27017/` + dbName, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to database " + dbName);
  })
  .catch(err => {
    console.log("Error in connection with " + dbName + " database: ", err);
  });

// remedy for error
// (node:29400) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set("useCreateIndex", true);

// Express session
app.use(
  session({
    // name of the cookie
    name: "kodikos.sid",
    resave: false,
    saveUninitialized: false,
    secret: "secret",
    cookie: {
      maxAge: 36000000,
      httpOnly: false,
      // secure: true,
      // sameSite: 'None'
    }
    // resave: true,
    // saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// I am using a body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//CORS
//Cross Origin Resource Sharing
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PATCH, PUT, DELETE, OPTIONS'
//   );
//   next();
// });
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "http://127.0.0.1:4200",
      "https://app.kodikos.pl:4501",
      "https://app.kodikos.pl:4502",
      "http://192.168.1.242:4505",
      "http://192.168.1.242",
      "http://mirportal.mir.local",
      "http://localhost:4501",
      "http://localhost:4502"
    ],
    credentials: true
  })
);

app.use('/kontakty', express.static(path.join(configBackend.plikiKontakty)));
app.use('/szkodliwe', express.static(path.join(configBackend.plikiSzkodliwe)));
app.use('/asortyment', express.static(path.join(configBackend.plikiAsortyment)));
app.use('/sekretariat', express.static(path.join(configBackend.plikiSekretariat)));
app.use('/magazyn', express.static(path.join(configBackend.plikiMagazyn)));
app.use('/pracownicy', express.static(path.join(configBackend.plikiPracownicy)));
app.use('/przesylki', express.static(path.join(configBackend.plikiPrzesylki)));

// I'm adding routes
app.use('/api/logowanieRejestracja', logowanieRejestracja);
app.use('/api/contractors', contractorsRoutes);
app.use('/api/szkodliwe', szkodliweRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/user', userRoutes);
app.use('/api/pracownicy', pracownicyRoutes);
app.use('/api/dictionary', dictionaryRoutes);
app.use("/api/dictionary2", dictionary2Routes);
app.use('/api/assortments', assortmentRoutes);
app.use('/api/klucze', kluczeRoutes);
app.use('/api/kluczeRejestr', kluczeRejestrRoutes);
app.use('/api/kluczeWydania', kluczeWydaniaRoutes);
app.use('/api/przesylki', przesylkiRoutes);
app.use('/api/sekretariat', sekretariatRoutes);
app.use('/api/offer', offersRoutes);
app.use('/api/project', projectsRoutes);
app.use('/api/order', ordersRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/nbp', nbpRoutes);
app.use('/api/krs', krsRoutes);
app.use('/api/formatki', formatkiRoutes);
app.use('/api/logindatas', loginDatas);
app.use('/api/filesSend', filesSend);


module.exports = app;
