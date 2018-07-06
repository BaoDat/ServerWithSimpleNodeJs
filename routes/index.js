global.router = require('express').Router();
var router = global.router;
router = require('./city');
router = require('./countries');
/* GET home page. */
router.get('/', (request, response, next) => {
    response.render('index', {title: 'My tutorial videos'});
});



module.exports = router;
