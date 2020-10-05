const express = require('express');
const router = express.Router();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// const checkAuth = require('../middleware/check-auth');
const { ensureAuthenticated } = require('../middleware/ensureAuth');

// router.get('/nip/:nipvalue', checkAuth, (req, res, next) => {
router.get('/nip/:nipvalue', ensureAuthenticated, (req, res, next) => {
    let http = new XMLHttpRequest();
    const nip = req.params.nipvalue;
    let url = 'https://rejestr.io/api/v1/krs?nip=' + nip;
    let method = 'GET';
    http.open(method, url);
    http.setRequestHeader('Authorization','260618e8-c355-48f7-a582-4a82e58e1701');

    http.onreadystatechange = () => {
        if(http.readyState === 4 && http.status === 200) {
            let data = http.responseText;
            res.send(data);
        } else if (http.readyState === 4 && http.status !== 200) {
            res.send('Brak danych w bazie KRS.');
        }
    };

    http.send();
});

module.exports = router;
