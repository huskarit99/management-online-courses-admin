const User = require('../models/user');
var bcrypt = require('bcrypt');

exports.student_list = (req, res, next) => {
    let page = Number(req.query.page) || Number(1);
    User.find({ role: 2, status: 1 }).lean().skip(4 * page - 4).limit(4)
        .exec(function(err, list_students) {
            if (err) { return next(err) };
            User.count({ role: 2, status: 1 }, function(err, count) {
                console.log(count);
                let num = 1 + 4 * (page - 1);
                let num_order = [num];
                let page_number = [1];
                let page_size = Math.ceil(count / 4);
                for (let index = 2; index <= list_students.length + num - 1; index++) {
                    num_order.push(index);
                }
                for (let index = 2; index <= page_size; index++) {
                    page_number.push(index);
                }
                res.render('students/list-students', {
                    title: 'Danh sách học viên',
                    num_order: num_order,
                    page: page,
                    page_number: page_number,
                    student_list: list_students
                });
            })

        });
};
exports.add_student = (req, res, next) => {
    res.render('students/add-student');
};

exports.post_student = (req, res, next) => {
    let email = req.body.email;
    let name = req.body.name;
    let username = req.body.username;
    let password = '123456';
    User.findOne({ email: email }, function(err, user) {
        if (user !== null) {
            res.render('students/add-student', { message: 'Email already exist' });
        } else {
            User.findOne({ username: username }, function(err, user) {
                if (user !== null) {
                    res.render('students/add-student', { message: 'Username already exist' });
                } else {
                    var salt = bcrypt.genSaltSync(10);
                    user = new User({
                        email: email,
                        name: name,
                        username: username,
                        password: bcrypt.hashSync(password, salt),
                        role: 2,
                        status: 1
                    });
                    user.save(function(err, result) {
                        if (err) return next(err);
                    });
                    res.redirect('/list-students');
                }
            });
        }
    });
};