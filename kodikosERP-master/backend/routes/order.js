const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const checkAuth = require('../middleware/check-auth');

// SAVING AN ORDER
// in post 'req' has some data in it
router.post('', checkAuth, (req, res, next) => {
  // with body-parser I'm getting data of assortment
  // in req
  const orderBody = req.body;
  // console.log(orderBody);

  // we can instantiate an object from model
  // because model method from order.js gives us an constructor
  const order = new Order(orderBody);
  // console.log(order);
  // zapis do bazy danych
  // nazwa kolekcji brana z modelu - (changed to lowercase and added 's') czyli orders
  order.save().then(createdOrder => {
    // console.log(createdOrder);
    // we need to set response becouse we should know the status
    res.status(201).json({
      message: 'Order added successfully.',
      orderId: createdOrder._id
    });
  });
});

// UPDATE AN ORDER
// I can use put or patch
router.put('/:id', checkAuth, (req, res, next) => {
  // I'm creating a new order object to store it in database
  const order = new Order(req.body);
  // because with new Order a new _id is crated I have to
  // set _id to the old value in other case update will fail
  order._id = req.params.id;
  Order.updateOne({ _id: req.params.id }, order).then(result => {
    // console.log(result);
    res.status(200).json({ message: 'Order updated.' });
  });
});

// READING ALL ORDERS
// we are adding middleware
// before (req,res,next) we can add as many filters as we want
// req is empty in get requests
router.get('', checkAuth, (req, res, next) => {
  // zwracam napis
  // res.send('Hello from express');

  // I'm getting data from the database
  Order.find().then(documents => {
    // console.log(documents);
    //zwracam json data
    res.status(200).json({
      message: 'Orders fetched successfully',
      orders: documents
    });
  });
});

// // READING ALL ORDERS WITHOUT PASSWORD
// // we are adding middleware
// // before (req,res,next) we can add as many filters as we want
// // req is empty in get requests
// router.get('/free', (req, res, next) => {
//   // zwracam napis
//   // res.send('Hello from express');

//   // I'm getting data from the database
//   Order.find().then(documents => {
//     // console.log(documents);
//     //zwracam json data
//     res.status(200).json({
//       message: 'Orders fetched successfully',
//       orders: documents
//     });
//   });
// });

// GET SINGLE ORDER
router.get('/:id', checkAuth, (req, res, next) => {
  Order.findById(req.params.id).then(order => {
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found.' });
    }
  });
});

// DELETEING AN ORDER
router.delete('/:id', checkAuth, (req, res, next) => {
  // console.log(req.params.id);
  Order.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Order deleted' });
  });
});

module.exports = router;
