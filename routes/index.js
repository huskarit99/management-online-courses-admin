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

router.get('/list-students', function(req, res, next) {
    res.render('students/list-students', { title: 'Express' });
});

router.get('/add-student', function(req, res, next) {
    res.render('students/add-student', { title: 'Express' });
});

router.get('/edit-student', function(req, res, next) {
    res.render('students/edit-student', { title: 'Express' });
});



module.exports = router;