var express = require('express');
var router = express.Router();
var teacherController = require('../controllers/teacherController');
var studentController = require('../controllers/studentController');
var categoryController = require('../controllers/categoryController');
var courseController = require('../controllers/courseController');
var userController = require('../controllers/userController');
const category = require('../models/category');

/* GET home page. */
router.get('/', userController.index);

/* teacher */
router.get('/list-teachers', teacherController.teacher_list);

router.post('/list-teachers', teacherController.post_teacher);

router.post('/list-teachers/edit-teacher/:id', teacherController.edit_teacher);

router.get('/list-teachers/lock-teacher/:id', teacherController.lock_teacher);

router.get('/list-teachers/unlock-teacher/:id', teacherController.unlock_teacher);

/* student */
router.get('/list-students', studentController.student_list);

router.post('/list-students', studentController.post_student);

router.post('/list-students/edit-student/:id', studentController.edit_student);

router.get('/list-students/lock-student/:id', studentController.lock_student);

router.get('/list-students/unlock-student/:id', studentController.unlock_student);

/* course */
router.get('/list-courses', courseController.list_courses);

router.get('/lock-course', courseController.lock_course);

router.get('/unlock-course', courseController.unlock_course);

/* category */
router.get('/list-root-categories', categoryController.list_root_categories);

router.get('/delete-category', categoryController.delete_category);

router.get('/add-category', function (req, res, next) {
    res.render('categories/add-category', { title: 'Express' });
});

router.get('/edit-category', categoryController.edit_category);
router.post('/post-category', categoryController.post_category);


/* admin */
router.get('/user-info', userController.user_info);

router.post('/user-info/edit-info', userController.edit_info);

router.post('/user-info/change-password', userController.change_password);

router.get('/logout', userController.logout);

router.get('/login', userController.login);

router.post('/login', userController.user_login);


module.exports = router;