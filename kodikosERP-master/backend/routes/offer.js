const express = require('express');
const router = express.Router();
const Offer = require('../models/offer');
const checkAuth = require('../middleware/check-auth');

// SAVING AN OFFER
// in post 'req' has some data in it
// router.post('', checkAuth, (req, res, next) => {
  router.post('', (req, res, next) => {
  // with body-parser I'm getting data of assortment
  // in req
  const offerBody = req.body;
  offerBody.addBy = {};
  offerBody.modBy = {};
  offerBody.addDate = new Date();
  offerBody.modDate = offerBody.addDate;
  offerBody.addBy.login = req.decoded.login;
  offerBody.addBy.name = req.decoded.name;
  offerBody.addBy.surname = req.decoded.surname;
  offerBody.addBy.email = req.decoded.email;
  offerBody.modBy.login = req.decoded.login;
  offerBody.modBy.name = req.decoded.name;
  offerBody.modBy.surname = req.decoded.surname;
  offerBody.modBy.email = req.decoded.email;
  if(typeof offerBody.items[0].name === 'undefined') {
    offerBody.items = [];
  }

  // we can instantiate an object from model
  // because model method from offer.js gives us an constructor
  const offer = new Offer(offerBody);
  // zapis do bazy danych
  // nazwa kolekcji brana z modelu - (changed to lowercase and added 's') czyli offers
  offer.save().then(createdOffer => {
    // we need to set response becouse we should know the status
    res.status(201).json({
      message: 'Offer added successfully.',
      offerId: createdOffer._id
    });
  });
});

// UPDATE AN OFFER
// I can use put or patch
// router.put('/:id', checkAuth, (req, res, next) => {
  router.put('/:id', (req, res, next) => {
  // I'm creating a new offer object to store it in database
  const offer = new Offer(req.body);
  // because with new Offer a new _id is crated I have to
  // set _id to the old value in other case update will fail
  offer.modDate = new Date();
  offer.modBy.login = req.decoded.login;
  offer.modBy.name = req.decoded.name;
  offer.modBy.surname = req.decoded.surname;
  offer.modBy.email = req.decoded.email;
  offer._id = req.params.id;
  Offer.updateOne({ _id: req.params.id }, offer).then(result => {
    res.status(200).json({ message: 'Offer updated.' });
  });
});

// READING ALL OFFERS
// router.get('', checkAuth, (req, res, next) => {
  router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  let currentPage = +req.query.page;
  // search params
  let selector = {};
  const shortName = req.query.shortName;
  const nip = req.query.nip;
  let offersQuery = '';
  let findStr = '';

  // shortName search
  if (shortName != null) {
    findStr = `.*${shortName}`;
    selector = {'contractor.shortName': { $regex: findStr, $options: "i"}};
  }
   // nip search
   if (nip != null) {
    findStr = `.*${nip}`;
    selector = {'contractor.nip': { $regex: findStr}};
  }

  offersQuery = Offer.find(selector).sort({ "modDate": -1 });
  let fetchedOffers;
  if (pageSize && currentPage) {
    offersQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  // I'm getting data from the database
  offersQuery.then(documents => {
    // res.status(200).json({
    //   message: 'Offers fetched successfully',
    //   offers: documents
    // });
    fetchedOffers = documents;
    return Offer.countDocuments();
  })
  .then(count => {
    res.status(200).json({
      message: 'Offers fetched successfully',
      offers: fetchedOffers,
      maxOffers: count,
      decoded: req.decoded
    });
  });
});

// GET SINGLE OFFER
// router.get('/:id', checkAuth, (req, res, next) => {
  router.get('/:id', (req, res, next) => {
  Offer.findById(req.params.id).then(offer => {
    if (offer) {
      console.log(offer);
      res.status(200).json({ offer: offer, decoded: req.decoded });
    } else {
      res.status(404).json({ message: 'Offer not found.' });
    }
  });
});

// DELETEING AN OFFER
// router.delete('/:id', checkAuth, (req, res, next) => {
  router.delete('/:id', (req, res, next) => {
  // console.log(req.params.id);
  Offer.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Offer deleted' });
  });
});

module.exports = router;
