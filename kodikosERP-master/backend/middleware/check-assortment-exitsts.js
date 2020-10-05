module.exports = (req, res, next) => {
  const Assortment = require('../models/assortment');
  const assortmentBody = req.body;

    Assortment.find({
      fullName: assortmentBody.fullName,
      rodzajTowaru: assortmentBody.rodzajTowaru,
      gatunek: assortmentBody.gatunek,
      atest: assortmentBody.atest,
      odbior: assortmentBody.odbior
     }).then(documents => {
      if (documents.length > 0) {
        res.status(200).json({
          message: 'Assortment exist',
        });
      } else {
        next();
      }
    });

};
