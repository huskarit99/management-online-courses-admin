const User = require('../models/user');
var bcrypt = require('bcrypt');

exports.student_list = (req, res, next) => {
    if (req.session.userSession) {
        const page = Number(req.query.page) || Number(1);
        User.find({ role: 2 }).lean().skip(4 * page - 4).limit(4)
            .exec(function (err, list_students) {
                if (err) { return next(err) };
                User.count({ role: 2, status: 1 }, function (err, count) {
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
                        currentPage: page,
                        page_number: page_number,
                        student_list: list_students
                    });
                })

            });
    } else {
        res.redirect('/login');
    }

};

exports.post_student = (req, res, next) => {
    let email = req.body.email;
    let name = req.body.name;
    let username = req.body.username;
    let password = '123456';
    User.findOne({ email: email }, function (err, user) {
        if (user !== null) {
            res.redirect('/list-students?error=' + encodeURIComponent('Email already exist'));
        } else {
            User.findOne({ username: username }, function (err, user) {
                if (user !== null) {
                    res.redirect('/list-students?error=' + encodeURIComponent('Username already exist'));
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
                    user.save(function (err, result) {
                        if (err) return next(err);
                    });
                    res.redirect('/list-students');
                }
            });
        }
    });
};

exports.edit_student = (req, res, next) => {
    let email = req.body.email;
    let name = req.body.name;
    let username = req.body.username;
    User.findOne({ username: username }, function (err, user) {
        if (user !== null) {
            if (user.name !== name) {
                user.name = name;
                if (user.email !== email) {
                    User.findOne({ email: email }, function (err, user_email) {
                        if (user_email !== null) {
                            res.redirect('/list-students?error=' + encodeURIComponent('Email already exist'));
                        } else {
                            user.email = email;
                            user.save(function (err, result) { });
                            res.redirect('/list-students');
                        }
                    });
                } else {
                    user.save(function (err, result) { });
                    res.redirect('/list-students');
                }
            } else {
                if (user.email !== email) {
                    User.findOne({ email: email }, function (err, user_email) {
                        if (user_email !== null) {
                            res.redirect('/list-students?error=' + encodeURIComponent('Email already exist'));
                        } else {
                            user.email = email;
                            user.save(function (err, result) { });
                            res.redirect('/list-students');
                        }
                    });
                } else {
                    res.redirect('/list-students');
                }
            }
        } else {
            res.redirect('/list-students?error=' + encodeURIComponent('User can not found'));
        }
    });
}

exports.lock_student = (req, res, next) => {
    let id = req.params.id;
    User.findOne({ _id: id }, function (err, user) {
        if (err) return next(err);
        user.status = 0;
        user.save(function (err, result) { });
        res.redirect('/list-students');
    })
}

exports.unlock_student = (req, res, next) => {
    let id = req.params.id;
    User.findOne({ _id: id }, function (err, user) {
        if (err) return next(err);
        user.status = 1;
        user.save(function (err, result) { });
        res.redirect('/list-students');
    })
}