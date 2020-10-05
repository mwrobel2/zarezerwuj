const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Przesylki = require('../models/przesylki');
const { ensureAuthenticated } = require('../middleware/ensureAuth');

// SAVING Przesylki
router.post('', ensureAuthenticated, (req, res, next) => {
  const url = req.protocol + '://' + req.get('host') + '/';
  const przesylkiBody = req.body;
  przesylkiBody.addBy = {};
  przesylkiBody.modBy = {};
  przesylkiBody.addDate = new Date();
  przesylkiBody.modDate = przesylkiBody.addDate;

  przesylkiBody.addBy.login = req.user.login;
  przesylkiBody.addBy.name = req.user.name;
  przesylkiBody.addBy.surname = req.user.surname;
  przesylkiBody.addBy.email = req.user.email;
  przesylkiBody.modBy.login = req.user.login;
  przesylkiBody.modBy.name = req.user.name;
  przesylkiBody.modBy.surname = req.user.surname;
  przesylkiBody.modBy.email = req.user.email;
  przesylkiBody.accountManager = req.user.name + ' ' + req.user.surname;
  przesylkiBody.accountManagerLogin = req.user.login;

  const przesylki = new Przesylki(przesylkiBody);
  przesylki.save().then(createdPrzesylki => {
    // we need to set response becouse we should know the status
    res.status(201).json({
      message: 'Przesylki added successfully.',
      przesylkiId: createdPrzesylki._id,
    });
  });
});



// UPDATE PRZESYLKI
// I can use put or patch
router.put('/:id/:wyslijMaila', ensureAuthenticated, (req, res, next) => {
  // I'm creating a new przesylki object to store it in database
  const przesylki = new Przesylki(req.body);
  // console.log(req.body);
  przesylki.modDate = new Date();
  przesylki.modBy.login = req.user.login;
  przesylki.modBy.name = req.user.name;
  przesylki.modBy.surname = req.user.surname;
  przesylki.modBy.email = req.user.email;
  // because with new Przesylki a new _id is crated I have to
  // set _id to the old value in other case update will fail
  przesylki._id = req.params.id;
  // console.log(req.params.wyslijMaila);
  if (req.params.wyslijMaila === 'true') {
    // wysyłam maila ----------------------
    let transporter = nodemailer.createTransport({
      host: "192.168.0.100",
      port: 25,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'mirportal', // generated ethereal user
        pass: 'MIR199!mir', // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // send mail with defined transport object
    let mailOptions = {
      from: '"MirPortal " <mirportal@mir.gdynia.pl>', // sender address
      to: `${przesylki.doKogoEmails}`, // list of receivers
      subject: "MirPortal - Przesyłki.", // Subject line
      text: "Przesyłka TXT", // plain text body
      html: `Twoja przesyłka z firmy:<br/>
      <b>${przesylki.fullName}</b>
      <br/>zmieniła status na: "<b>${przesylki.status}</b>".
      <br/></br>Pozdrowienia<br/>MirPortal<br/>
      <div style="font-size:10px;"><br/>PS.<br/>List został wygenerowany automatycznie.<br/>Nie odpowiadaj na niego.</div>`, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      // console.log("Message sent: %s", info.messageId);
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
  }

  Przesylki.updateOne({ _id: req.params.id }, przesylki).then(result => {
    res.status(200).json({ message: 'Przesylki updated.' });
  });
});


// READING ALL PRZESYLKI
// we are adding middleware
// before (req,res,next) we can add as many filters as we want
// req is empty in get requests
router.get('', ensureAuthenticated, (req, res, next) => {
  // dla paginacji sprawdzam query parameters
  const pageSize = +req.query.pagesize;
  let currentPage = +req.query.page;
  const fname = req.query.fname;
  const nrZapotrzebowania = req.query.nrZapotrzebowania;
  const status = req.query.status;
  const doKogo = req.query.doKogo;
  const comments = req.query.comments;
  const accountManagerLogin = req.query.accountManagerLogin;
  let przesylkiQuery = '';
  let findStr = '';
  let selector = {};

  // fullName - nazwa firmy - search
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
    // kluzeQuery = Przesylki.find(selector);
  }

  // accountManagerLogin - search
  if (accountManagerLogin != null) {
    selector.accountManagerLogin = `${accountManagerLogin}`;
  }

  // nrZapotrzebowania - search
  if (nrZapotrzebowania != null) {
    findStr = `.*${nrZapotrzebowania}`;
    const words = nrZapotrzebowania.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.nrZapotrzebowania = { $regex: findStr, $options: "i" };
  }


  // Status - search
  if (status != null) {
    findStr = `.*${status}`;
    const words = status.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.status = { $regex: findStr, $options: "i" };
  }

  // doKogo - search
  if (doKogo != null) {
    findStr = `.*${doKogo}`;
    const words = doKogo.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.doKogo = { $regex: findStr, $options: "i" };
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

  przesylkiQuery = Przesylki.find(selector).sort({ "modDate": -1 });

  let fetchedPrzesylki;
  if (pageSize && currentPage) {
    przesylkiQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  // I'm getting data from the database
  przesylkiQuery.then(documents => {
    fetchedPrzesylki = documents;

    //zwracam liczbę dokumentow
    if (fname != null) {
      return Object.keys(documents).length;
    } else {
      return Przesylki.countDocuments();
    }
  })
    .then(count => {
      res.status(200).json({
        message: 'Przesylki fetched successfully',
        przesylki: fetchedPrzesylki,
        maxPrzesylki: count,
      });
    });
});

// GET SINGLE PRZESYLKI
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  Przesylki.findById(req.params.id).then(przesylki => {
    if (przesylki) {
      res.status(200).json({ przesylki: przesylki });
    } else {
      res.status(404).json({ message: 'Przesylki not found.' });
    }
  });
});

// GET PRZESYLKI BY TYPE
router.get('/type/:assortType', ensureAuthenticated, (req, res, next) => {
  Przesylki.find({ rodzajTowaru: req.params.przesylkiType }).then(documents => {
    res.status(200).json({
      message: 'Przesylki fetched successfully',
      przesylki: documents
    });
  });
});

// DELETEING PRZESYLKI
router.delete('/:id', ensureAuthenticated, (req, res, next) => {
  Przesylki.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: 'Przesylki deleted' });
  });
});

module.exports = router;
