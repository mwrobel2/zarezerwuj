const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  // I'm getting the token from incomming request
  // try {
    const token = req.headers.authorization.split(' ')[1];
    // if there is a token I should verify it
    jwt.verify(token, 'mojsekret_to_jest_moj_tajny_sekret',(error, decodedToken) => {
      if(error) {
        res.status(401).json({
          message: 'Auth failed'
        });
      } else {
        req.decoded = decodedToken;
        next();
      }
    });
    // if verify is successfull it means that I have a valid toke
    // i am sending decoded payload of the token
    // if (wynik) {
    //   // req.decoded = decodedToken;
    //   next();
    // }
  // } catch (error) {
  //   // There is not token - I'm not authenticated
  //   res.status(401).json({
  //     message: 'Auth failed'
  //   });
  // }
};
