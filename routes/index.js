var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('users/index', { title: 'Express' });
});

router.get('/list-teachers', function(req, res, next) {
    res.render('teachers/list-teachers', { title: 'Express' });
});

router.get('/add-teacher', function(req, res, next) {
    res.render('teachers/add-teacher', { title: 'Express' });
});

router.get('/edit-teacher', function(req, res, next) {
    res.render('teachers/edit-teacher', { title: 'Express' });
});



module.exports = router;