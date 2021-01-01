const User = require('../models/user');
var bcrypt = require('bcrypt');

exports.teacher_list = (req, res, next) => {
    User.find({ role: 1 }).lean().exec(function(err, list_teachers) {
        if (err) { return next(err) };
        console.log(list_teachers);
        res.render('teachers/list-teachers', {
            title: 'Danh sách giáo viên',
            teacher_list: list_teachers
        });
    });
};

exports.add_teacher = (req, res, next) => {
    res.render('teachers/add-teacher');
};

exports.post_teacher = (req, res, next) => {
    let email = req.body.email;
    let name = req.body.name;
    let username = req.body.username;
    let password = '123456';
    User.findOne({ email: email }, function(err, user) {
        if (user !== null) {
            res.render('teachers/add-teacher', { message: 'Email already exist' });
        } else {
            var salt = bcrypt.genSaltSync(10);
            user = new User({
                email: email,
                name: name,
                username: username,
                password: bcrypt.hashSync(password, salt),
                role: 1
            });
            user.save(function(err, result) {
                if (err) return next(err);
            });
            res.redirect('/list-teachers');
        }
    });
};