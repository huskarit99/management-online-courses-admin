var express = require('express');
var router = express.Router();
var teacherController = require('../controllers/teacherController');
var studentController = require('../controllers/studentController');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('users/index', { title: 'Express' });
});

/* teacher */
router.get('/list-teachers', teacherController.teacher_list);

router.get('/add-teacher', teacherController.add_teacher);

router.post('/add-teacher', teacherController.post_teacher);

router.get('/list-teachers/edit-teacher/:id', teacherController.detail_teacher);

router.post('/list-teachers/edit-teacher/:id', teacherController.edit_teacher);

router.get('/list-teachers/:id', teacherController.delete_teacher);

/* student */
router.get('/list-students', studentController.student_list);

router.get('/add-student', studentController.add_student);

router.post('/add-student', studentController.post_student);

router.get('/list-students/edit-student/:id', studentController.detail_student);

router.post('/list-students/edit-student/:id', studentController.edit_student);

router.get('/list-students/:id', studentController.delete_student);

/* course */
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