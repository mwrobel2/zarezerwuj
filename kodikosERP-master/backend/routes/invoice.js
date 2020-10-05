const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');
const checkAuth = require('../middleware/check-auth');

// SAVING AN Invoice
// in post 'req' has some data in it
router.post('', checkAuth, (req, res, next) => {
  // with body-parser I'm getting data of assortment
  // in req
  const invoiceBody = req.body;
  // console.log(invoiceBody);

  // we can instantiate an object from model
  // because model method from invoice.js gives us an constructor
  const invoice = new Invoice(invoiceBody);
  // console.log(invoice);
  // zapis do bazy danych
  // nazwa kolekcji brana z modelu - (changed to lowercase and added 's') czyli invoices
  invoice.save().then(createdInvoice => {
    // console.log(createdInvoice);
    // we need to set response becouse we should know the status
    res.status(201).json({
      message: 'Invoice added successfully.',
      invoiceId: createdInvoice._id
    });
  });
});

// UPDATE AN INVOICE
// I can use put or patch
router.put('/:id', checkAuth, (req, res, next) => {
  // I'm creating a new invoice object to store it in database
  const invoice = new Invoice(req.body);
  // because with new Invoice a new _id is crated I have to
  // set _id to the old value in other case update will fail
  invoice._id = req.params.id;
  Invoice.updateOne({ _id: req.params.id }, invoice).then(result => {
    // console.log(result);
    res.status(200).json({ message: 'Invoice updated.' });
  });
});

// READING ALL INVOICES
// we are adding middleware
// before (req,res,next) we can add as many filters as we want
// req is empty in get requests
router.get('', checkAuth, (req, res, next) => {
  // zwracam napis
  // res.send('Hello from express');

  // I'm getting data from the database
  Invoice.find().then(documents => {
    // console.log(documents);
    //zwracam json data
    res.status(200).json({
      message: 'Invoices fetched successfully',
      invoices: documents
    });
  });
});

// // READING ALL INVOICESS WITHOUT PASSWORD
// // we are adding middleware
// // before (req,res,next) we can add as many filters as we want
// // req is empty in get requests
// router.get('/free', (req, res, next) => {
//   // zwracam napis
//   // res.send('Hello from express');

//   // I'm getting data from the database
//   Invoice.find().then(documents => {
//     // console.log(documents);
//     //zwracam json data
//     res.status(200).json({
//       message: 'Invoices fetched successfully',
//       invoices: documents
//     });
//   });
// });

// GET SINGLE INVOICE
router.get('/:id', checkAuth, (req, res, next) => {
  Invoice.findById(req.params.id).then(invoice => {
    if (invoice) {
      res.status(200).json(invoice);
    } else {
      res.status(404).json({ message: 'Invoice not found.' });
    }
  });
});

// DELETEING AN INVOICE
router.delete('/:id', checkAuth, (req, res, next) => {
  // console.log(req.params.id);
  Invoice.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Invoice deleted' });
  });
});

module.exports = router;
