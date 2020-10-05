const express = require('express');
const router = express.Router();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const checkAuth = require('../middleware/check-auth');

router.get('/usdMid', checkAuth, (req, res, next) => {
// router.get('/usdMid', (req, res, next) => {
    // zwracam napis

    let http = new XMLHttpRequest();
    // let url = 'https://api.nbp.pl/api/exchangerates/rates/c/usd/today/';
    // let url = 'https://api.nbp.pl/api/exchangerates/rates/a/usd/';
    let url = 'http://api.nbp.pl/api/exchangerates/rates/a/usd/';
    let method = 'GET';
    http.open(method, url);

    http.onreadystatechange = () => {
        // console.log(http.status);
        // console.log('readyState:', http.readyState);
        // console.log(http.responseText);

        if(http.readyState === 4 && http.status === 200) {
        // if (http.status === 200) {
            let data = http.responseText;
            res.send(data);
        } else if (http.readyState === 4 && http.status !== 200) {
            res.send('NBP. USD sredni kurs. Brak danych.');
        }
    };

    http.send();

    // res.send('Hello from nbp');
    // res.send(http.responseText);
});


router.get('/eurMid', checkAuth, (req, res, next) => {
    let http = new XMLHttpRequest();
    let url = 'http://api.nbp.pl/api/exchangerates/rates/a/eur/';
    let method = 'GET';
    http.open(method, url);

    http.onreadystatechange = () => {
        if(http.readyState === 4 && http.status === 200) {
            let data = http.responseText;
            res.send(data);
        } else if (http.readyState === 4 && http.status !== 200) {
            res.send('NBP. EUR sredni kurs. Brak danych.');
        }
    };
    http.send();
});


router.get('/rubMid', checkAuth, (req, res, next) => {
    let http = new XMLHttpRequest();
    let url = 'http://api.nbp.pl/api/exchangerates/rates/a/rub/';
    let method = 'GET';
    http.open(method, url);

    http.onreadystatechange = () => {
        if(http.readyState === 4 && http.status === 200) {
            let data = http.responseText;
            res.send(data);
        } else if (http.readyState === 4 && http.status !== 200) {
            res.send('NBP. RUB sredni kurs. Brak danych.');
        }
    };
    http.send();
});

router.get('/uahMid', checkAuth, (req, res, next) => {
    let http = new XMLHttpRequest();
    let url = 'http://api.nbp.pl/api/exchangerates/rates/a/uah/';
    let method = 'GET';
    http.open(method, url);

    http.onreadystatechange = () => {
        if(http.readyState === 4 && http.status === 200) {
            let data = http.responseText;
            res.send(data);
        } else if (http.readyState === 4 && http.status !== 200) {
            res.send('NBP. UAH sredni kurs. Brak danych.');
        }
    };
    http.send();
});

module.exports = router;
