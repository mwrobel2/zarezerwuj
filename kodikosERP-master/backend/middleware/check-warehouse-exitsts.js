module.exports = (req, res, next) => {
  const Warehouse = require('../models/warehouse');
  const warehouseBody = req.body;

  Warehouse.find({
    fullName: warehouseBody.fullName,
    rodzajTowaru: warehouseBody.rodzajTowaru,
  }).then(documents => {
    if (documents.length > 0) {
      res.status(200).json({
        message: 'Warehouse exist',
      });
    } else {
      next();
    }
  });

};
