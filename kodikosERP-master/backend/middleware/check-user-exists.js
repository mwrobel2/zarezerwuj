module.exports = (req, res, next) => {
  const User = require('../models/user');
  const userBody = req.body;
  // console.log(userBody);
  User.find({ login: userBody.login }).then(documents => {
    // console.log(documents.length);
      if (documents.length > 0) {
          // there is a document with that login in database
          // res.status(409).json({
          //     message: `Record with ${userBody.login} already exists in database.`
          // });
          res.status(200).json({
              message: 'User exists',
              userLogin: userBody.login
          });
      } else {
          next();
      }
  });
};
