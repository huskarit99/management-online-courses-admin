var express = require('express');
var router = express.Router();
var teacherController = require('../controllers/teacherController');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('users/index', { title: 'Express' });
});

router.get('/list-teachers', teacherController.teacher_list);

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

router.get('/list-courses', function(req, res, next) {
    res.render('courses/list-courses', { title: 'Express' });
});

router.get('/detail-course', function(req, res, next) {
    res.render('courses/detail-course', { title: 'Express' });
});

router.get('/list-root-categories', function(req, res, next) {
    res.render('categories/list-root-categories', { title: 'Express' });
});

router.get('/list-categories', function(req, res, next) {
    res.render('categories/list-categories', { title: 'Express' });
});

router.get('/add-category', function(req, res, next) {
    res.render('categories/add-category', { title: 'Express' });
});

router.get('/edit-category', function(req, res, next) {
    res.render('categories/edit-category', { title: 'Express' });
});

router.get('/user-info', function(req, res, next) {
    res.render('users/user-info', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.render('users/login', { title: 'Express' });
});






module.exports = router;