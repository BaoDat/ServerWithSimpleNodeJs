router = require('./city');
/* GET home page. */
router.get('/', (request, response, next) => {
    response.render('index', {title: 'My tutorial videos'});
});



module.exports = router;
