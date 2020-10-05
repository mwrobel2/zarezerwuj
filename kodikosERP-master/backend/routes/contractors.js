const express = require('express');
const router = express.Router();
const Contractor = require('../models/contractor');
// const checkAuth = require('../middleware/check-auth');
const checkNipExists = require('../middleware/check-contractor-nip-exists');
// const passport = require('passport');
const { ensureAuthenticated } = require('../middleware/ensureAuth');
// const multer = require('multer');

// // multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'backend/files/contractors');
//   },
//   filename: (req, file, cb) => {
//     // console.log(file);
//     const name = file.originalname.toLowerCase().split(' ').join('_');
//     cb(null, Date.now() + '_' + name);
//   }
// });

// passport.initialize();
// passport.session();

// SAVING A CONTRACTOR
// in post 'req' has some data in it
router.post('', ensureAuthenticated, checkNipExists, (req, res, next) => {
  // router.post('', ensureAuthenticated, checkNipExists, multer({storage: storage}).single('plik'), (req, res, next) => {
  // url info
  const url = req.protocol + '://' + req.get('host') + '/';
  // with body-parser I'm getting data of contractor
  // in req
  const contractorBody = req.body;
  // console.log(req.user);
  contractorBody.addBy = {};
  contractorBody.modBy = {};
  if (contractorBody.nip) {
    contractorBody.nip = contractorBody.nip.replace(/-/g, '');
    contractorBody.nip = contractorBody.nip.replace(/ /g, '');
  }
  contractorBody.addDate = new Date();
  contractorBody.modDate = contractorBody.addDate;

  contractorBody.addBy.login = req.user.login;
  contractorBody.addBy.name = req.user.name;
  contractorBody.addBy.surname = req.user.surname;
  contractorBody.addBy.email = req.user.email;
  contractorBody.modBy.login = req.user.login;
  contractorBody.modBy.name = req.user.name;
  contractorBody.modBy.surname = req.user.surname;
  contractorBody.modBy.email = req.user.email;
  contractorBody.accountManager = req.user.name + ' ' + req.user.surname;
  contractorBody.accountManagerLogin = req.user.login;
  // contractorBody.plikSciezka = url + 'contractors/' + req.file.filename;
  // contractorBody.paymentDeadline = JSON.parse(contractorBody.paymentDeadline);
  // contractorBody.anotherContacts = JSON.parse(contractorBody.anotherContacts);

  // console.log(req.body);
  // we can instantiate an object from model
  // because model method from contractor.js gives us an constructor
  const contractor = new Contractor(contractorBody);
  // zapis do bazy danych
  // nazwa kolekcji brana z modelu - (changed to lowercase and added 's') czyli contractors
  contractor.save().then(createdContractor => {
    // we need to set response becouse we should know the status
    res.status(201).json({
      message: 'Contractor added successfully.',
      contractorId: createdContractor._id,
      // plikSciezka: createdContractor.plikSciezka
    });
  });
});



// UPDATE A CONTRACTOR
// I can use put or patch
router.put('/:id', ensureAuthenticated, (req, res, next) => {
  // I'm creating a new contractor object to store it in database
  const contractor = new Contractor(req.body);
  contractor.modDate = new Date();
  contractor.modBy.login = req.user.login;
  contractor.modBy.name = req.user.name;
  contractor.modBy.surname = req.user.surname;
  contractor.modBy.email = req.user.email;
  // because with new Contractor a new _id is crated I have to
  // set _id to the old value in other case update will fail
  contractor._id = req.params.id;
  Contractor.updateOne({ _id: req.params.id }, contractor).then(result => {
    res.status(200).json({ message: 'Contractor updated.' });
  });
});



// READING ALL CONTRACTORS
// we are adding middleware
// before (req,res,next) we can add as many filters as we want
// req is empty in get requests
router.get('', ensureAuthenticated, (req, res, next) => {
  // router.get('', ensureAuthenticated, (req, res, next) => {
  // console.log('decoded', req.decoded);
  // zwracam napis
  // res.send('Hello from express');

  // to powinno iść z Passprot.js
  // console.log(req.user);
  // console.log('RQ', req.query);

  // dla paginacji sprawdzam query parameters
  const pageSize = +req.query.pagesize;
  let currentPage = +req.query.page;
  const fname = req.query.fname;
  const name = req.query.name;
  const nip = req.query.nip;
  const accountManagerLogin = req.query.accountManagerLogin;
  const comments = req.query.comments;
  let contractorsQuery = '';
  let findStr = '';
  let selector = {};

  // console.log('aml', accountManagerLogin);

  // fullName - search
  if (fname != null) {
    findStr = `.*${fname}`;

    const words = fname.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.fullName = { $regex: findStr, $options: "i" };
    // contractorsQuery = Contractor.find(selector);
  }

  // name - search
  if (name != null) {
    findStr = `.*${name}`;
    const words = name.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.shortName = { $regex: findStr, $options: "i" };
  }

  // nip - search
  if (nip != null) {
    findStr = `.*${nip}`;
    selector.nip = { $regex: findStr };
  }

  // // addBy - search
  // if (addBy != null) {
  //   selector["addBy.login"] = `${addBy}`;
  // }

  // accountManagerLogin - search
  if (accountManagerLogin != null) {
    selector.accountManagerLogin = `${accountManagerLogin}`;
  }

  // comments - search
  if (comments != null) {
    findStr = `.*${comments}`;
    const words = comments.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.comments = { $regex: findStr, $options: "i" };
  }

  contractorsQuery = Contractor.find(selector).sort({ "modDate": -1 });




  let fetchedContractors;
  if (pageSize && currentPage) {
    contractorsQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  // I'm getting data from the database
  contractorsQuery.then(documents => {
    fetchedContractors = documents;
    // console.log(documents);
    // console.log(Object.keys(documents).length);
    //zwracam json data
    // res.status(200).json({
    //   message: 'Contractors fetched successfully',
    //   contractors: documents
    // });

    //zwracam liczbę dokumentow
    if (fname != null) {
      return Object.keys(documents).length;
    } else {
      return Contractor.countDocuments();
    }
  })
    .then(count => {
      // console.log(fetchedContractors);
      res.status(200).json({
        message: 'Contractors fetched successfully',
        contractors: fetchedContractors,
        maxContractors: count,
        // decoded: req.decoded
      });
    });
});

// GET SINGLE CONTRACTOR
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  // console.log('decodedSingle', req.decoded);
  Contractor.findById(req.params.id).then(contractor => {
    if (contractor) {
      res.status(200).json({ contractor: contractor });
    } else {
      res.status(404).json({ message: 'Contractor not found.' });
    }
  });
});

// GET CONTRACTORS BY TYPE
router.get('/type/:contrType', ensureAuthenticated, (req, res, next) => {
  Contractor.find({ contrType: req.params.contrType }).then(documents => {
    //zwracam json data
    res.status(200).json({
      message: 'Contractors fetched successfully',
      contractors: documents
    });
  });
});

// DELETEING A CONTRACTOR
router.delete('/:id', ensureAuthenticated, (req, res, next) => {
  Contractor.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: 'Contractor deleted' });
  });
});

module.exports = router;
