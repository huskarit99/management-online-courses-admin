var express = require('express');
var router = express.Router();
var teacherController = require('../controllers/teacherController');
var studentController = require('../controllers/studentController');
var categoryController = require('../controllers/categoryController');
var courseController = require('../controllers/courseController');
var userController = require('../controllers/userController');
const category = require('../models/category');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('users/index', { title: 'Express' });
});

/* teacher */
router.get('/list-teachers', teacherController.teacher_list);

router.post('/list-teachers', teacherController.post_teacher);

router.post('/list-teachers/edit-teacher/:id', teacherController.edit_teacher);

router.get('/list-teachers/:id', teacherController.delete_teacher);

/* student */
router.get('/list-students', studentController.student_list);

router.post('/list-students', studentController.post_student);

router.post('/list-students/edit-student/:id', studentController.edit_student);

router.get('/list-students/:id', studentController.delete_student);

/* course */
router.get('/list-courses', courseController.list_courses);

router.get('/detail-course', function(req, res, next) {
    res.render('courses/detail-course', { title: 'Express' });
});

/* category */
router.get('/list-root-categories', categoryController.list_root_categories);

router.get('/add-category', function(req, res, next) {
    res.render('categories/add-category', { title: 'Express' });
});

router.get('/edit-category', categoryController.edit_category);
router.post('/post-category', categoryController.post_category);


/* admin */
router.get('/user-info', function(req, res, next) {
    res.render('users/user-info', { title: 'Express' });
});

router.get('/login', userController.login);

router.post('/login', userController.user_login);


module.exports = router;