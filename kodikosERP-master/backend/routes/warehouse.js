const express = require('express');
const router = express.Router();
const Warehouse = require('../models/warehouse');
const checkWarehouseExists = require('../middleware/check-warehouse-exitsts');
const { ensureAuthenticated } = require('../middleware/ensureAuth');

// SAVING AN WAREHOUSE
router.post('', ensureAuthenticated, checkWarehouseExists, (req, res, next) => {
  const url = req.protocol + '://' + req.get('host') + '/';
  const warehouseBody = req.body;
  warehouseBody.addBy = {};
  warehouseBody.modBy = {};
  warehouseBody.addDate = new Date();
  warehouseBody.modDate = warehouseBody.addDate;

  warehouseBody.addBy.login = req.user.login;
  warehouseBody.addBy.name = req.user.name;
  warehouseBody.addBy.surname = req.user.surname;
  warehouseBody.addBy.email = req.user.email;
  warehouseBody.modBy.login = req.user.login;
  warehouseBody.modBy.name = req.user.name;
  warehouseBody.modBy.surname = req.user.surname;
  warehouseBody.modBy.email = req.user.email;
  warehouseBody.accountManager = req.user.name + ' ' + req.user.surname;
  warehouseBody.accountManagerLogin = req.user.login;

  const warehouse = new Warehouse(warehouseBody);
  // zapis do bazy danych
  // nazwa kolekcji brana z modelu - (changed to lowercase and added 's') czyli warehouses
  warehouse.save().then(createdWarehouse => {
    // we need to set response becouse we should know the status
    res.status(201).json({
      message: 'Warehouse added successfully.',
      warehouseId: createdWarehouse._id,
    });
  });
});



// UPDATE AN WAREHOUSE
// I can use put or patch
router.put('/:id', ensureAuthenticated, (req, res, next) => {
  // I'm creating a new warehouse object to store it in database
  const warehouse = new Warehouse(req.body);
  warehouse.modDate = new Date();
  warehouse.modBy.login = req.user.login;
  warehouse.modBy.name = req.user.name;
  warehouse.modBy.surname = req.user.surname;
  warehouse.modBy.email = req.user.email;
  // because with new Warehouse a new _id is crated I have to
  // set _id to the old value in other case update will fail
  warehouse._id = req.params.id;
  Warehouse.updateOne({ _id: req.params.id }, warehouse).then(result => {
    res.status(200).json({ message: 'Warehouse updated.' });
  });
});



// READING ALL WAREHOUSE
// we are adding middleware
// before (req,res,next) we can add as many filters as we want
// req is empty in get requests
router.get('', ensureAuthenticated, (req, res, next) => {
  // dla paginacji sprawdzam query parameters
  const pageSize = +req.query.pagesize;
  let currentPage = +req.query.page;
  const fname = req.query.fname;
  const name = req.query.name;
  const accountManagerLogin = req.query.accountManagerLogin;
  const comments = req.query.comments;
  const rodzajTowaru = req.query.rodzajTowaru;
  const warehouseLocation = req.query.warehouseLocation;
  const itemNumber = req.query.itemNumber;
  let warehousesQuery = '';
  let findStr = '';
  let selector = {};

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
    // warehousesQuery = Warehouse.find(selector);
  }

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

  // rodzajTowaru - search
  if (rodzajTowaru != null) {
    findStr = `.*${rodzajTowaru}`;
    const words = rodzajTowaru.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.rodzajTowaru = { $regex: findStr, $options: "i" };
  }

  // warehouseLocation - search
  if (warehouseLocation != null) {
    findStr = `.*${warehouseLocation}`;
    const words = warehouseLocation.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.warehouseLocation = { $regex: findStr, $options: "i" };
  }

  // itemNumber - search
  if (itemNumber != null) {
    findStr = `.*${itemNumber}`;
    const words = itemNumber.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.itemNumber = { $regex: findStr, $options: "i" };
  }

  warehousesQuery = Warehouse.find(selector).sort({ "modDate": -1 });

  let fetchedWarehouses;
  if (pageSize && currentPage) {
    warehousesQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  // I'm getting data from the database
  warehousesQuery.then(documents => {
    fetchedWarehouses = documents;

    //zwracam liczbę dokumentow
    if (fname || itemNumber || rodzajTowaru || warehouseLocation || comments) {
      // return Object.keys(warehousesQuery).length;
      return Warehouse.find(selector).countDocuments();
    } else {
      return Warehouse.countDocuments();
    }
  })
    .then(count => {
      res.status(200).json({
        message: 'Warehouse fetched successfully',
        warehouses: fetchedWarehouses,
        maxWarehouses: count
      });
    });
});

// GET SINGLE WAREHOUSE
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  // console.log('decodedSingle', req.decoded);
  Warehouse.findById(req.params.id).then(warehouse => {
    if (warehouse) {
      res.status(200).json({ warehouse: warehouse });
    } else {
      res.status(404).json({ message: 'Warehouse not found.' });
    }
  });
});

// GET WAREHOUSE BY TYPE
router.get('/type/:assortType', ensureAuthenticated, (req, res, next) => {
  Warehouse.find({ rodzajTowaru: req.params.assortType }).then(documents => {
    res.status(200).json({
      message: 'Warehouse fetched successfully',
      warehouses: documents
    });
  });
});

// GET WAREHOUSE BY FULL NAME
// RETURNS 15 results
// router.get('/name/:nazwaTowaru([^/]*/[^/]*)', ensureAuthenticated, (req, res, next) => {
router.get('/name/:nazwaTowaru', ensureAuthenticated, (req, res, next) => {
  // console.log('bb', Object.keys(req.params.nazwaTowaru));
  // console.log('bb', Object.values(req.params.nazwaTowaru));
  // console.log('bb', req.params.nazwaTowaru);

  let findStrTow = '';
  let selectorTow = {};

  // fullName - search
  if (req.params.nazwaTowaru != null) {
    findStrTow = `.*${req.params.nazwaTowaru}`;

    const words = req.params.nazwaTowaru.split(' ');
    if (words.length > 1) {
      findStrTow = '';
      for (let word of words) {
        findStrTow += `(?=.*${word})`;
      }
    }
    selectorTow.fullName = { $regex: findStrTow, $options: "i" };
  }

  // Warehouse.find({ fullName: req.params.nazwaTowaru }).then(documents => {
  Warehouse.find(selectorTow).limit(15).then(documents => {
    res.status(200).json({
      message: 'Warehouse fetched successfully',
      warehouses: documents
    });
  });
});

// DELETEING A WAREHOUSE
router.delete('/:id', ensureAuthenticated, (req, res, next) => {
  Warehouse.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: 'Warehouse deleted' });
  });
});

module.exports = router;
