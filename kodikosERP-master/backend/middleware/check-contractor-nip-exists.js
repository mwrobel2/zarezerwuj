module.exports = (req, res, next) => {
  const Contractor = require('../models/contractor');
  const contractorBody = req.body;


  // console.log('NIP ', contractorBody.nip);

  // if nip doesn't exist it means that it was not provided
  // and we don't check it in database

  if (typeof contractorBody.nip !== 'undefined' && contractorBody.nip !== null) {

    Contractor.find({ nip: contractorBody.nip }).then(documents => {
      if (documents.length > 0) {
        // there is a document with that nip in database
        // res.status(409).json({
        //     message: `Record with ${contractorBody.nip} already exists in database.`
        // });
        res.status(200).json({
          message: 'Contractor exist',
        });
      } else {
        next();
      }
    });

  } else {
    next();
  }

};
