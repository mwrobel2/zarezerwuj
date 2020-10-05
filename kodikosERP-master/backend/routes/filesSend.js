const express = require('express');
const router = express.Router();
const multer = require('multer');
const { ensureAuthenticated } = require('../middleware/ensureAuth');
const fs = require('fs');
const configBackend = require('../config/configBackend.js');

// multer configuration for contractors
const storageContractors = multer.diskStorage({
  // originalname: (req, file, cb) => {
  // },
  destination: (req, file, cb) => {
    // console.log('REQ', req);
    cb(null, configBackend.plikiKontakty);
  },
  filename: (req, file, cb) => {
    // console.log(file);
    // console.log(req);
    let name = file.originalname.toLowerCase().split(' ').join('_');
    name = name.split('%').join('_');
    name = name.split('\'').join('_');
    name = name.split('\"').join('_');
    cb(null, Date.now() + '_' + name);
    // cb(null, file.originalname);
  }
});


// multer configuration for substancjeSzkodliwe
const storageSzkodliwe = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, configBackend.plikiSzkodliwe);
  },
  filename: (req, file, cb) => {
    let name = file.originalname.toLowerCase().split(' ').join('_');
    name = name.split('%').join('_');
    name = name.split('\'').join('_');
    name = name.split('\"').join('_');
    cb(null, Date.now() + '_' + name);
  }
});

// multer configuration for asortyment
const storageAsortyment = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, configBackend.plikiAsortyment);
  },
  filename: (req, file, cb) => {
    let name = file.originalname.toLowerCase().split(' ').join('_');
    name = name.split('%').join('_');
    name = name.split('\'').join('_');
    name = name.split('\"').join('_');
    cb(null, Date.now() + '_' + name);
  }
});

// multer configuration for magazyn
const storageMagazyn = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, configBackend.plikiMagazyn);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    cb(null, Date.now() + '_' + name);
  }
});


// multer configuration for przesylki
const storagePrzesylki = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, configBackend.plikiPrzesylki);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    cb(null, Date.now() + '_' + name);
  }
});

// multer configuration for pracownicy
const storagePracownicy = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, configBackend.plikiPracownicy);
  },
  filename: (req, file, cb) => {
    let name = file.originalname.toLowerCase().split(' ').join('_');
    name = name.split('%').join('_');
    name = name.split('\'').join('_');
    name = name.split('\"').join('_');
    cb(null, Date.now() + '_' + name);
  }
});

// post contractors
router.post('', ensureAuthenticated, multer({ storage: storageContractors }).array('pliki'), (req, res, next) => {
  const pliki = req.files;

  // console.log(pliki);
  // console.log(req.body.nazwy);
  // console.log(req.body.katalog);

  if (!pliki) {
    const err = new Error('No file');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send({
    status: 'ok',
    plikiZapisane: pliki
  });
});


// delete contractors
router.delete('/:nazwaPliku', (req, res, next) => {
  const nazwaLocal = req.params.nazwaPliku;
  const pathFile = configBackend.plikiKontakty + nazwaLocal;
  // console.log(nazwaLocal);
  fs.unlink(pathFile, (err) => {
    if (err) {
      console.log(err);
      res.send({ usuniety: 'error' });
      return;
    } else {
      res.send({ usuniety: 'ok' });
    }
  });
});

// nie działa - do sprawdzenia
router.delete('/sync/:nazwaPliku2', (req, res, next) => {
  const nazwaLocal2 = req.params.nazwaPliku2;
  const pathFile2 = configBackend.plikiKontakty + nazwaLocal2;
  console.log(nazwaLocal2);
  try {
    fs.unlinkSync(pathFile2);
  } catch (err) {
    console.log('USUN PLIK SYNC: ', err);
  }
});

// post szkodliwe
router.post('/szkodliwe', ensureAuthenticated, multer({ storage: storageSzkodliwe }).array('pliki'), (req, res, next) => {
  const pliki = req.files;
  if (!pliki) {
    const err = new Error('No file');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send({
    status: 'ok',
    plikiZapisane: pliki
  });
});
// delete szkodliwe
router.delete('/szkodliwe/:nazwaPliku', (req, res, next) => {
  const nazwaLocal = req.params.nazwaPliku;
  const pathFile = configBackend.plikiSzkodliwe + nazwaLocal;
  fs.unlink(pathFile, (err) => {
    if (err) {
      console.log(err);
      res.send({ usuniety: 'error' });
      return;
    } else {
      res.send({ usuniety: 'ok' });
    }
  });
});



// post asortyment
router.post('/asortyment', ensureAuthenticated, multer({ storage: storageAsortyment }).array('pliki'), (req, res, next) => {
  const pliki = req.files;
  if (!pliki) {
    const err = new Error('No file');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send({
    status: 'ok',
    plikiZapisane: pliki
  });
});
// delete asortyment
router.delete('/asortyment/:nazwaPliku', (req, res, next) => {
  const nazwaLocal = req.params.nazwaPliku;
  const pathFile = configBackend.plikiAsortyment + nazwaLocal;
  fs.unlink(pathFile, (err) => {
    if (err) {
      console.log(err);
      res.send({ usuniety: 'error' });
      return;
    } else {
      res.send({ usuniety: 'ok' });
    }
  });
});

// post magazyn
router.post('/magazyn', ensureAuthenticated, multer({ storage: storageMagazyn }).array('pliki'), (req, res, next) => {
  const pliki = req.files;
  if (!pliki) {
    const err = new Error('No file');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send({
    status: 'ok',
    plikiZapisane: pliki
  });
});
// delete magazyn
router.delete('/magazyn/:nazwaPliku', (req, res, next) => {
  const nazwaLocal = req.params.nazwaPliku;
  const pathFile = configBackend.plikiMagazyn + nazwaLocal;
  fs.unlink(pathFile, (err) => {
    if (err) {
      console.log(err);
      res.send({ usuniety: 'error' });
      return;
    } else {
      res.send({ usuniety: 'ok' });
    }
  });
});



// post przesylki
router.post('/przesylki', ensureAuthenticated, multer({ storage: storagePrzesylki }).array('pliki'), (req, res, next) => {
  const pliki = req.files;
  if (!pliki) {
    const err = new Error('No file');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send({
    status: 'ok',
    plikiZapisane: pliki
  });
});

// post pracownicy
router.post('/pracownicy', ensureAuthenticated, multer({ storage: storagePracownicy }).array('pliki'), (req, res, next) => {
  const pliki = req.files;
  if (!pliki) {
    const err = new Error('No file');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send({
    status: 'ok',
    plikiZapisane: pliki
  });
});

// dlete przesylki
router.delete('/przesylki/:nazwaPliku', (req, res, next) => {
  const nazwaLocal = req.params.nazwaPliku;
  const pathFile = configBackend.plikiPrzesylki + nazwaLocal;
  fs.unlink(pathFile, (err) => {
    if (err) {
      console.log(err);
      res.send({ usuniety: 'error' });
      return;
    } else {
      res.send({ usuniety: 'ok' });
    }
  });
});

// delete pracownicy
router.delete('/pracownicy/:nazwaPliku', (req, res, next) => {
  const nazwaLocal = req.params.nazwaPliku;
  const pathFile = configBackend.plikiPracownicy + nazwaLocal;
  fs.unlink(pathFile, (err) => {
    if (err) {
      console.log(err);
      res.send({ usuniety: 'error' });
      return;
    } else {
      res.send({ usuniety: 'ok' });
    }
  });
});

module.exports = router;
